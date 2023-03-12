/**
 * These class canonicalize, sign and appends right signature node info into bank messages
 */
import {ApplicationRequestSignatureInterface} from './interfaces';
import {createHash, createSign, createVerify} from 'crypto';
import * as xmlBuilder from 'xmlbuilder';
import {Canonicalize, CanonicalizeWithDomParser, FormatResponseCertificate} from './utils/utils';
import {DOMParser} from '@xmldom/xmldom';

const xpath = require('xpath');


class ApplicationRequestSignature {

  private readonly CANONICALIZE_METHOD = 'http://www.w3.org/2001/10/xml-exc-c14n#WithComments';
  private readonly SIGNATURE_METHOD = 'rsa-sha1';
  private readonly DIGEST_METHOD = 'sha1';

  // constructor() {
  // }

  /**
   * Constructs signature, digest and other nodes
   * @param ars, ApplicationRequestSignatureInterface requirements
   */
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async createSignature(ars: ApplicationRequestSignatureInterface): Promise<any> {
    const canonicalRequestXml = await CanonicalizeWithDomParser(ars.requestXml, this.CANONICALIZE_METHOD);

    const signedInfoNode = {
      'SignedInfo': {
        '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
        'CanonicalizationMethod': {
          '@Algorithm': this.CANONICALIZE_METHOD,
        },
        'SignatureMethod': {
          '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.SIGNATURE_METHOD,
        },
        'Reference': {
          '@URI': '',
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          'Transforms': {
            'Transform': {
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
              '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
            }
          },
          'DigestMethod': {
            '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#' + this.DIGEST_METHOD,
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          },
          'DigestValue': {
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
            '#text': this.getDigestValue(canonicalRequestXml)
          },
        }
      },
    };

    const signedInfoXml: string = xmlBuilder.create(signedInfoNode, {headless: true}).end({pretty: false});
    const canonicalSignedInfoXml = await CanonicalizeWithDomParser(signedInfoXml, this.CANONICALIZE_METHOD);

    const signature = {
      'Signature': {
        '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
        '#text': [
          // 'SignedInfo' is appended here
          {
            'SignatureValue': {
              '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
              '#text': this.getSignatureValue(ars.signingPrivateKey, canonicalSignedInfoXml)
            }
          },
          {
            'KeyInfo': {
              '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
              'X509Data': {
                '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                'X509Certificate': {
                  '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                  '#text': ars.X509Certificate
                },
              }
            }
          },
        ]
      }
    };

    // @ts-ignore
    signature['Signature']['#text'].unshift({'SignedInfo': signedInfoNode['SignedInfo']});

    return signature;
  }


  /**
   * Validate response signature from SignedInfo node
   * @param xml
   */
  public async validateSignature(xml: string): Promise<boolean> {
    try {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const signatureValue = xpath.select('//*[local-name()=\'SignatureValue\']', doc)[0].textContent;
      const X509Certificate = xpath.select('//*[local-name()=\'X509Certificate\']', doc)[0].textContent;
      const formattedCertificate = FormatResponseCertificate(X509Certificate);

      const SignedInfoNode = xpath.select('//*[local-name()=\'SignedInfo\']', doc)[0];
      const canonicalize = await Canonicalize(SignedInfoNode, this.CANONICALIZE_METHOD);

      return this.verifySignature(
        formattedCertificate,
        canonicalize,
        signatureValue);
    } catch (e) {
      throw new Error('validateEnvelopeSignature has failed - ' + e);
    }
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
  ApplicationRequestSignature,
}
