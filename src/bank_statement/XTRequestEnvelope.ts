'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment';
import {Base64DecodeStr, Canonicalize, CleanUpCertificate, GetUuid, LoadFileFromPath} from '../utils';
import {XTInterface} from '../interfaces';
import {createHash, createSign} from 'crypto';

class XTRequestEnvelope {

  private xt: XTInterface;
  private readonly applicationRequest: string;
  private readonly timeStampUuid: string;
  private readonly bodyUuid: string;
  private readonly binarySecurityTokenUuid: string;

  private readonly CANONICALIZE_METHOD = 'http://www.w3.org/2001/10/xml-exc-c14n#WithComments';
  private readonly SIGNATURE_METHOD = 'rsa-sha1';
  private readonly DIGEST_METHOD = 'sha1';

  constructor(xt: XTInterface, applicationRequest: string) {
    this.xt = xt;
    this.applicationRequest = applicationRequest;
    this.timeStampUuid = GetUuid('Timestamp');
    this.bodyUuid = GetUuid('B');
    this.binarySecurityTokenUuid = GetUuid('CertId');
  }

  public async createXmlBody(): Promise<string> {
    if (this.xt.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xt.Base64EncodedClientPrivateKey);

    const signingCsr = CleanUpCertificate(await LoadFileFromPath(this.xt.CsrPath, 'utf-8'));

    const timeStampNode = {
      'wsu:Timestamp': {
        '@wsu:Id': this.timeStampUuid,
        'wsu:Created': this.getCreated(),
        'wsu:Expires': this.getExpires(),
      }
    };
    let timeStampNodeXml: string = xmlBuilder.create(timeStampNode).end({pretty: false});

    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'cor:downloadFileListin': {
          'mod:RequestHeader': {
            'mod:SenderId': this.xt.userParams.customerId,
            'mod:RequestId': this.xt.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.xt.language,
            'mod:UserAgent': this.getSoftwareId(),
            'mod:ReceiverId': 'SAMLINK',
          },
          'mod:ApplicationRequest': {
            '#text': this.applicationRequest
          },
        },
      },
    };
    let bodyNodeXml: string = xmlBuilder.create(bodyNode, {headless: true}).end({pretty: false});

    let canonicalizeBodyNodeXml = await Canonicalize(
      bodyNodeXml
        .replace(/soapenv:Body/g, 'Body')
        .replace('xmlns:wsu', 'xmlns')
        .replace('wsu:Id', 'Id')
        .replace(/cor:downloadFileListin/g, 'downloadFileListin')
        .replace(/mod:/g, '')
      , this.CANONICALIZE_METHOD
    );


    canonicalizeBodyNodeXml = canonicalizeBodyNodeXml
      .replace(/Body/g, 'soapenv:Body')
      .replace('xmlns', 'xmlns:wsu')
      .replace('Id', 'wsu:Id')
      .replace(/downloadFileListin/g, 'cor:downloadFileListin')
      .replace(/RequestHeader/g, 'mod:RequestHeader')
      .replace(/SenderId/g, 'mod:SenderId')
      .replace(/RequestId/g, 'mod:RequestId')
      .replace(/Timestamp/g, 'mod:Timestamp')
      .replace(/Language/g, 'mod:Language')
      .replace(/UserAgent/g, 'mod:UserAgent')
      .replace(/ReceiverId/g, 'mod:ReceiverId')
      .replace(/ApplicationRequest/g, 'mod:ApplicationRequest')
    ;


    const signedInfoNode = {
      'ds:SignedInfo': {
        'ds:CanonicalizationMethod': {
          '@Algorithm': this.CANONICALIZE_METHOD
        },
        'ds:SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.SIGNATURE_METHOD
        },

        'ds:Reference': [
          // {
          //   '@URI': '#' + this.timeStampUuid,
          //   'ds:Transforms': {
          //     'ds:Transform': {
          //       '@Algorithm': this.CANONICALIZE_METHOD
          //     },
          //     'ds:DigestMethod': {
          //       '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD
          //     },
          //     'ds:DigestValue': this.getDigestValue(timeStampNodeXml),
          //   },
          // },
          {
            '@URI': '#' + this.bodyUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': this.CANONICALIZE_METHOD
              },
            },
            'ds:DigestMethod': {
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD
            },
            'ds:DigestValue': this.getDigestValue(canonicalizeBodyNodeXml),
          }
        ],
      },
    };

    let envelopeObject = {
      'soapenv:Envelope': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'soapenv:Header': {
          'wsse:Security': {
            '@xmlns:wsse': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
            '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
            '@soapenv:mustUnderstand': '1',
            '#text': [
              // 'wsu:Timestamp' node is appended here
              {
                'wsse:BinarySecurityToken': {
                  '@EncodingType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
                  '@ValueType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3',
                  '@wsu:Id': this.binarySecurityTokenUuid,
                  '#text': signingCsr,
                },
              },
              {
                'ds:Signature': {
                  '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                  '#text': [
                    // 'ds:SignedInfo' node is appended here
                    {
                      'ds:SignatureValue': this.getSignatureValue(signingKey, bodyNodeXml),
                    },
                    {
                      'ds:KeyInfo': {
                        'wsse:SecurityTokenReference': {
                          'wsse:Reference': {
                            '@URI': '#' + this.binarySecurityTokenUuid,
                            '@ValueType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3'
                          }
                        }
                      },
                    }
                  ],
                }
              },
            ]
          }
        },
        // 'soapenv:Body' node is appended here
      }
    };

    // @ts-ignore
    envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["#text"].unshift({'wsu:Timestamp': timeStampNode["wsu:Timestamp"]});
    // @ts-ignore
    envelopeObject["soapenv:Envelope"]["soapenv:Body"] = bodyNode["soapenv:Body"];
    // @ts-ignore
    envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["#text"][2]["ds:Signature"]["#text"].unshift({'ds:SignedInfo': signedInfoNode["ds:SignedInfo"]});


    let xml_: xmlBuilder.XMLElement = xmlBuilder.create(envelopeObject);
    const xml = xml_.end({pretty: false});

    console.log(xml);
    // process.exit(0);

    return xml;
  }

  // noinspection JSMethodCanBeStatic
  private getCreated(): string {
    return moment().format('YYYY-MM-DDThh:mm:ssZ');
  }

  // noinspection JSMethodCanBeStatic
  private getExpires(): string {
    return moment().add(5, 'minutes').format('YYYY-MM-DDThh:mm:ssZ');
  }

  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
  }

  // noinspection JSMethodCanBeStatic
  private getDigestValue(node: string): string {
    const shaSum = createHash(this.DIGEST_METHOD);
    shaSum.update(node);
    return shaSum.digest('base64');
  }

  // noinspection JSMethodCanBeStatic
  private getSignatureValue(signingKey: string, node: string): string {
    const sign = createSign(this.SIGNATURE_METHOD);
    sign.update(node);
    sign.end();
    const signature = sign.sign(signingKey);
    return signature.toString('base64');
  }


}

export {
  XTRequestEnvelope
};
