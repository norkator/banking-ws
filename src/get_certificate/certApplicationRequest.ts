'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {GetCertificateInterface} from '../interfaces';
import {Base64DecodeStr, Base64EncodeStr, Canonicalize, CleanUpCertificate, LoadFileFromPath} from '../utils';
import {createHash, createSign} from 'crypto';
import * as fs from "fs";


class CertApplicationRequest {

  private readonly CANONICALIZE_METHOD = 'http://www.w3.org/2001/10/xml-exc-c14n#WithComments';
  private gc: GetCertificateInterface;

  constructor(gc: GetCertificateInterface) {
    this.gc = gc;
  }

  public async createXmlBody(): Promise<string | undefined> {
    const csr = await LoadFileFromPath(this.gc.CsrPath, 'utf-8');

    let certRequestObj: any = {
      'CertApplicationRequest': {
        '@xmlns': 'http://op.fi/mlp/xmldata/',
        // '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        // '@xsi:schemaLocation': 'http://op.fi/mlp/xmldata/ file:////csamnt1/K830186$/Datapower/schemas/CertApplicationRequest_20090422.xsd',
        'CustomerId': this.gc.userParams.customerId,
        'Timestamp': this.gc.Timestamp, // 2012-12-13T12:12:12
        'Environment': this.gc.userParams.environment,
        'SoftwareId': this.getSoftwareId(),
        'Command': this.gc.Command,
        'Service': 'ISSUER',
        'Content': Base64EncodeStr(csr), // Base64 encoded -----BEGIN CERTIFICATE REQUEST----- ...
      }
    };
    if (this.gc.Command === 'GetCertificate') {
      if (this.gc.TransferKey === undefined) {
        throw new Error('TransferKey cannot be undefined')
      }
      certRequestObj.CertApplicationRequest['TransferKey'] = this.gc.TransferKey;

      let xml: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      return xml.end({pretty: true});
    }

    if (this.gc.Command === 'RenewCertificate') {
      if (this.gc.Base64EncodedClientPrivateKey === undefined) {
        throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
      }
      const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);

      const requestXml: string = xmlBuilder.create(certRequestObj).end({pretty: false});
      const canonicalRequestXml = await Canonicalize(requestXml, this.CANONICALIZE_METHOD);
      // console.log(c);
      // process.exit(0);

      const signedInfoNode = {
        'SignedInfo': {
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          'CanonicalizationMethod': {
            '@Algorithm': this.CANONICALIZE_METHOD,
          },
          'SignatureMethod': {
            '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
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
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1',
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
      const canonicalSignedInfoXml = await Canonicalize(signedInfoXml, this.CANONICALIZE_METHOD);
      // console.log(signedInfoXml);
      // process.exit(0);

      if (this.gc.BankCsrPath === undefined) {
        throw new Error('BankCsrPath is undefined')
      }
      const bankCertificate = CleanUpCertificate(await LoadFileFromPath(this.gc.BankCsrPath, 'utf-8'));

      let signature = {
        'Signature': {
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          '#text': [
            // 'SignedInfo' is appended here
            {
              'SignatureValue': {
                '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                '#text': this.getSignatureValue(signingKey, canonicalSignedInfoXml)
              }
            },
            {
              'KeyInfo': {
                '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                'X509Data': {
                  '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                  'X509Certificate': {
                    '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                    '#text': bankCertificate
                  },
                }
              }
            },
          ]
        }
      };

      // @ts-ignore
      signature["Signature"]["#text"].unshift({'SignedInfo': signedInfoNode["SignedInfo"]});
      // @ts-ignore
      certRequestObj.CertApplicationRequest["Signature"] = signature["Signature"];


      let xml: string = xmlBuilder.create(certRequestObj).end({pretty: false});


      // console.log(xml);
      // fs.writeFileSync("signed.xml", xml)
      // process.exit(0);

      return xml;
    }

    return undefined;
  }

  private getSoftwareId(): string {
    return this.gc.SoftwareId.name + '-' + this.gc.SoftwareId.version;
  }


  // noinspection JSMethodCanBeStatic
  private getDigestValue(node: string): string {
    const shaSum = createHash('sha1');
    shaSum.update(node);
    return shaSum.digest('base64');
  }

  // noinspection JSMethodCanBeStatic
  private getSignatureValue(signingKey: string, node: string): string {
    const sign = createSign('rsa-sha1');
    sign.update(node);
    sign.end();
    const signature = sign.sign(signingKey);
    return signature.toString('base64');
  }


}

export {
  CertApplicationRequest
};
