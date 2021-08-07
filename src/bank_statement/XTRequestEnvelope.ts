'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment';
import {Base64DecodeStr, CleanUpCertificate, GetUuid, LoadFileFromPath} from '../utils';
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
    this.timeStampUuid = GetUuid('TS');
    this.bodyUuid = GetUuid('id');
    this.binarySecurityTokenUuid = GetUuid('X509');
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
          '@xmlns:mod': 'http://model.bxd.fi',
          'mod:RequestHeader': {
            '@xmlns:mod': 'http://model.bxd.fi',
            'mod:SenderId': this.xt.userParams.customerId,
            'mod:RequestId': this.xt.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.xt.language,
            'mod:UserAgent': this.getSoftwareId(),
            'mod:ReceiverId': 'SAMLINK',
          },
          'mod:ApplicationRequest': {
            '@xmlns:mod': 'http://model.bxd.fi',
            '#text': this.applicationRequest
          },
        },
      },
    };
    let bodyNodeXml: string = xmlBuilder.create(bodyNode).end({pretty: false});

    const signedInfoNode = {
      'ds:SignedInfo': {
        'ds:CanonicalizationMethod': {
          '@Algorithm': this.CANONICALIZE_METHOD
        },
        'ds:SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.SIGNATURE_METHOD
        },

        'ds:Reference': [
          {
            '@URI': '#' + this.timeStampUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': this.CANONICALIZE_METHOD
              },
              'ds:DigestMethod': {
                '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD
              },
              'ds:DigestValue': this.getDigestValue(timeStampNodeXml),
            },
          },
          {
            '@URI': '#' + this.bodyUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': this.CANONICALIZE_METHOD
              },
              'ds:DigestMethod': {
                '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD
              },
              'ds:DigestValue': this.getDigestValue(bodyNodeXml),
            }
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
    // envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["ds:Signature"]["ds:SignedInfo"] = signedInfoNode["ds:SignedInfo"];
    envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["#text"][2]["ds:Signature"]["#text"].unshift({'ds:SignedInfo': signedInfoNode["ds:SignedInfo"]});


    let xml_: xmlBuilder.XMLElement = xmlBuilder.create(envelopeObject);
    const xml = xml_.end({pretty: false});

    console.log(xml);
    process.exit(0);

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
