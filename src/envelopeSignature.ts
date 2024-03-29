/**
 * This class canonicalize, sign and appends right nodes into envelope basically creating ready to send envelope
 */
import {createHash, createSign, createVerify} from 'crypto';
import {Canonicalize, CanonicalizeWithDomParser, FormatResponseCertificate, GetUuid} from './utils/utils';
import * as xmlBuilder from 'xmlbuilder';
import {DOMParser} from '@xmldom/xmldom';
// @ts-ignore
import moment from 'moment';

const xpath = require('xpath');


class EnvelopeSignature {

  private readonly CANONICALIZE_METHOD_REQUEST = 'http://www.w3.org/2001/10/xml-exc-c14n#WithComments';
  private readonly CANONICALIZE_METHOD_RESPONSE = 'http://www.w3.org/2001/10/xml-exc-c14n#';
  private readonly SIGNATURE_METHOD = 'rsa-sha1';
  private readonly DIGEST_METHOD = 'sha1';

  private readonly timeStampUuid: string;
  private readonly binarySecurityTokenUuid: string;

  constructor() {
    this.timeStampUuid = GetUuid('Timestamp');
    this.binarySecurityTokenUuid = GetUuid('CertId');
  }

  /**
   * Construct ready canonicalize, digest appended, signed Soap envelope
   * message is valid for 5 minutes after it's creation
   * @param bodyNode, body elements as an object
   * @param bodyUuid, URI reference like 'B-eb0cf901-32c8-4d54-a995-975d4ceccd4f'
   * @param signingKey, Base64EncodedClientPrivateKey used to sign message
   * @param binarySecurityToken, Base64EncodedBankCsr
   */
  public async constructEnvelopeWithSignature(
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    bodyNode: {[name: string]: any}, bodyUuid: string, signingKey: string, binarySecurityToken: string
  ): Promise<string> {
    const timeStampNode = {
      'wsu:Timestamp': {
        '@wsu:Id': this.timeStampUuid,
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        'wsu:Created': this.getCreated(),
        'wsu:Expires': this.getExpires(),
      }
    };
    const timeStampNodeXml: string = xmlBuilder.create(timeStampNode, {headless: true}).end({pretty: false});
    const canonicalizeTimeSampNodeXml = await CanonicalizeWithDomParser(timeStampNodeXml, this.CANONICALIZE_METHOD_REQUEST);


    const bodyNodeXml: string = xmlBuilder.create(bodyNode, {headless: true}).end({pretty: false});
    const canonicalizeBodyNodeXml = await CanonicalizeWithDomParser(bodyNodeXml, this.CANONICALIZE_METHOD_REQUEST);

    const signedInfoNode = {
      'ds:SignedInfo': {
        '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
        'ds:CanonicalizationMethod': {
          '@Algorithm': this.CANONICALIZE_METHOD_REQUEST
        },
        'ds:SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.SIGNATURE_METHOD
        },

        'ds:Reference': [
          {
            '@URI': '#' + this.timeStampUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': this.CANONICALIZE_METHOD_REQUEST
              },
            },
            'ds:DigestMethod': {
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD
            },
            'ds:DigestValue': this.getDigestValue(canonicalizeTimeSampNodeXml),
          },
          {
            '@URI': '#' + bodyUuid,
            'ds:Transforms': {
              'ds:Transform': {
                '@Algorithm': this.CANONICALIZE_METHOD_REQUEST
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
    const signedInfoNodeXml: string = xmlBuilder.create(signedInfoNode, {headless: true}).end({pretty: false});
    const canonicalizeSignedInfoNodeXml = await CanonicalizeWithDomParser(signedInfoNodeXml, this.CANONICALIZE_METHOD_REQUEST);

    const envelopeObject = {
      'soapenv:Envelope': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
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
                  '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
                  '#text': binarySecurityToken,
                },
              },
              {
                'ds:Signature': {
                  '@xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
                  '#text': [
                    // 'ds:SignedInfo' node is appended here
                    {
                      'ds:SignatureValue': this.getSignatureValue(signingKey, canonicalizeSignedInfoNodeXml),
                    },
                    {
                      'ds:KeyInfo': {
                        'wsse:SecurityTokenReference': {
                          '@xmlns': '',
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
    envelopeObject['soapenv:Envelope']['soapenv:Header']['wsse:Security']['#text'].unshift({'wsu:Timestamp': timeStampNode['wsu:Timestamp']});
    // @ts-ignore
    envelopeObject['soapenv:Envelope']['soapenv:Body'] = bodyNode['soapenv:Body'];
    // @ts-ignore
    envelopeObject['soapenv:Envelope']['soapenv:Header']['wsse:Security']['#text'][2]['ds:Signature']['#text'].unshift({'ds:SignedInfo': signedInfoNode['ds:SignedInfo']});


    return xmlBuilder.create(envelopeObject).end({pretty: false});
  }


  public async validateEnvelopeSignature(envelopeXml: string): Promise<boolean> {
    try {
      const doc = new DOMParser().parseFromString(envelopeXml, 'text/xml');
      const signedInfoNode = xpath.select('//*[local-name()=\'SignedInfo\']', doc);
      const signatureValue = xpath.select('//*[local-name()=\'SignatureValue\']', doc)[0].textContent;
      const canonicalizeSignedInfoXml = await Canonicalize(signedInfoNode[0], this.CANONICALIZE_METHOD_RESPONSE);
      const X509Certificate = xpath.select('//*[local-name()=\'BinarySecurityToken\']', doc)[0].textContent;
      const formattedCertificate = FormatResponseCertificate(X509Certificate);

      return this.verifySignature(
        formattedCertificate,
        canonicalizeSignedInfoXml,
        signatureValue);
    } catch (e) {
      throw new Error('validateEnvelopeSignature has failed - ' + e);
    }
  }


  // noinspection JSMethodCanBeStatic
  private getCreated(): string {
    return moment().toISOString();
  }

  // noinspection JSMethodCanBeStatic
  private getExpires(): string {
    return moment().add(5, 'minutes').toISOString();
  }

  private getDigestValue(node: string): string {
    const shaSum = createHash(this.DIGEST_METHOD);
    shaSum.update(node);
    
    return shaSum.digest('base64');
  }

  private getSignatureValue(signingKey: string, node: string): string {
    const sign = createSign(this.SIGNATURE_METHOD);
    sign.update(node);
    sign.end();
    const signature = sign.sign(signingKey);
    
    return signature.toString('base64');
  }

  // public keys can be derived from private keys, a private key may be passed instead of a public key.
  private verifySignature(certificate: string, node: string, envelopeSignatureValue: string): boolean {
    const verifier = createVerify(this.SIGNATURE_METHOD);
    verifier.update(node);
    
    return verifier.verify(certificate, envelopeSignatureValue, 'base64');
  }

}


export {
  EnvelopeSignature,
}
