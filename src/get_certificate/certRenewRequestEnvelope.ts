'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment'
import {Base64DecodeStr} from '../utils';
import {GetCertificateInterface} from '../interfaces';

class CertRenewRequestEnvelope {

  private gc: GetCertificateInterface;
  private readonly senderId: string;
  private readonly requestId: string;
  private readonly applicationRequest: string;

  constructor(gc: GetCertificateInterface, applicationRequest: string) {
    this.gc = gc;
    this.applicationRequest = applicationRequest;
  }

  public createXmlBody(): string {
    const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);

    // noinspection JSDuplicatedDeclaration,JSDuplicatedDeclaration
    const envelopeObject = {
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
            'wsu:Timestamp': {
              '@wsu:Id': '',
              'wsu:Created': CertRenewRequestEnvelope.getCreated(),
              'wsu:Expires': CertRenewRequestEnvelope.getExpires(),
            },
            'ds:Signature': {
              '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
              'ds:SignedInfo': {
                'ds:CanonicalizationMethod': {
                  '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
                },
                'ds:SignatureMethod': {
                  '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
                },
                'ds:Reference': {
                  '@URI': '',
                  'ds:Transforms': {
                    'ds:Transform': {
                      '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
                    },
                    'ds:DigestMethod': {
                      '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1'
                    },
                    'ds:DigestValue': this.getDigestValue(),
                  },
                },
                // @ts-ignore
                'ds:Reference': {
                  '@URI': '',
                  'ds:Transforms': {
                    'ds:Transform': {
                      '@Algorithm': 'http://www.w3.org/2001/10/xml-exc-c14n#'
                    },
                    'ds:DigestMethod': {
                      '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1'
                    },
                    'ds:DigestValue': this.getDigestValue(),
                  }
                }
              },
              'ds:SignatureValue': this.getSignatureValue(),
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
        'soapenv:Body': {
          'opc:getCertificatein': {
            'opc:RequestHeader': {
              'opc:SenderId': this.gc.userParams.customerId,
              'opc:RequestId': this.gc.RequestId,
              'opc:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ')
            },
            'opc:ApplicationRequest': this.applicationRequest,
          },
        },
      }
    };


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

  private getSignatureValue(): string {
    return '';
  }

  private getDigestValue(): string {
    return '';
  }

}

export {
  CertRenewRequestEnvelope
};
