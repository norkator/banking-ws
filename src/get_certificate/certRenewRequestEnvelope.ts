'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment';
import {Base64DecodeStr, GetUuid} from '../utils';
import {GetCertificateInterface} from '../interfaces';
import {createHash, createSign} from 'crypto';
import {node} from "webpack";

class CertRenewRequestEnvelope {

  private gc: GetCertificateInterface;
  private readonly applicationRequest: string;
  private readonly timeStampUuid: string;
  private readonly bodyUuid: string;

  constructor(gc: GetCertificateInterface, applicationRequest: string) {
    this.gc = gc;
    this.applicationRequest = applicationRequest;
    this.timeStampUuid = GetUuid('TS');
    this.bodyUuid = GetUuid('id');
  }

  public createXmlBody(): string {
    if (this.gc.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);

    const timeStampNode = {
      'wsu:Timestamp': {
        '@wsu:Id': this.timeStampUuid,
        'wsu:Created': CertRenewRequestEnvelope.getCreated(),
        'wsu:Expires': CertRenewRequestEnvelope.getExpires(),
      }
    };

    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'opc:getCertificatein': {
          'opc:RequestHeader': {
            'opc:SenderId': this.gc.userParams.customerId,
            'opc:RequestId': this.gc.RequestId,
            'opc:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ')
          },
          'opc:ApplicationRequest': this.applicationRequest,
        },
      },
    };

    const signedInfoNode = {
      'ds:SignedInfo': {
        'ds:CanonicalizationMethod': {
          '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
        },
        'ds:SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
        },

        'ds:Reference': [
          {
            '@URI': '#' + this.timeStampUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
              },
              'ds:DigestMethod': {
                '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1'
              },
              'ds:DigestValue': this.getDigestValue(timeStampNode.toString()),
            },
          },
          {
            '@URI': '#' + this.bodyUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
              },
              'ds:DigestMethod': {
                '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1'
              },
              'ds:DigestValue': this.getDigestValue(bodyNode.toString()),
            }
          }
        ],
      },
    };

    let envelopeObject = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:opc': 'http://mlp.op.fi/OPCertificateService',
        'soapenv:Header': {

          'wsse:Security': {
            '@xmlns:wsse': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
            '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
            '@soapenv:mustUnderstand': '1',
            'wsse:BinarySecurityToken': {
              '@EncodingType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
              '@ValueType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3',
              '@wsu:Id': this.getWsuId(),
              '#text': this.getBinarySecurityToken(),
            },
            // 'wsu:Timestamp' node is appended here
            'ds:Signature': {
              '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
              // 'ds:SignedInfo' node is appended here
              'ds:SignatureValue': this.getSignatureValue(signingKey, bodyNode.toString()),
              'ds:KeyInfo': {
                'wsse:SecurityTokenReference': {
                  'wsse:Reference': {
                    '@ValueType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3'
                  }
                }
              },

            }
          }
        },
        // 'soapenv:Body' node is appended here
      }
    };

    envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["wsu:Timestamp"] = timeStampNode["wsu:Timestamp"];
    envelopeObject["soapenv:Envelope"]["soapenv:Body"] = bodyNode["soapenv:Body"];
    envelopeObject["soapenv:Envelope"]["soapenv:Header"]["wsse:Security"]["ds:Signature"]["ds:SignedInfo"] = signedInfoNode["ds:SignedInfo"];


    let xml_: xmlBuilder.XMLElement = xmlBuilder.create(envelopeObject);
    const xml = xml_.end({pretty: true});

    console.log(xml);
    process.exit(0);

    return xml;
  }

  private getWsuId(): string {
    return '';
  }

  private getBinarySecurityToken(): string {
    return '';
  }

  private static getCreated(): string {
    return moment().format('YYYY-MM-DDThh:mm:ssZ');
  }

  private static getExpires(): string {
    return moment().add(5, 'minutes').format('YYYY-MM-DDThh:mm:ssZ');
  }

  private getDigestValue(node: string): string {
    var shaSum = createHash('sha1');
    shaSum.update(node);
    return shaSum.digest('base64');
  }

  private getSignatureValue(signingKey: string, node: string): string {
    const sign = createSign('rsa-sha1');
    sign.update(node);
    sign.end();
    const signature = sign.sign(signingKey);
    const sig = signature.toString('base64');
    console.log(sig);
    return sig;
  }


}

export {
  CertRenewRequestEnvelope
};
