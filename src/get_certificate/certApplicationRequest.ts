'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {GetCertificateInterface} from '../interfaces';
import {Base64DecodeStr, Base64EncodeStr, CleanUpCertificate, LoadFileFromPath} from '../utils';
import {createHash, createSign} from "crypto";


class CertApplicationRequest {

  private gc: GetCertificateInterface;

  constructor(gc: GetCertificateInterface) {
    this.gc = gc;
  }

  public async createXmlBody(): Promise<string | undefined> {
    const csr = await LoadFileFromPath(this.gc.CsrPath, 'utf-8');
    const cleanedSigningCsr = CleanUpCertificate(csr);

    let certRequestObj: any = {
      'CertApplicationRequest': {
        '@xmlns': 'http://op.fi/mlp/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://op.fi/mlp/xmldata/ file:////csamnt1/K830186$/Datapower/schemas/CertApplicationRequest_20090422.xsd',
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

      let tempRequest_: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      const requestXml = tempRequest_.end({pretty: true});

      // console.log(requestXml)
      // process.exit(0);

      const signedInfoNode = {
        'SignedInfo': {
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          'CanonicalizationMethod': {
            '@Algorithm': 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments',
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
          },
          'SignatureMethod': {
            '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
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
              '#text': this.getDigestValue(requestXml)
            },
          }
        },
      };

      const signedInfo_: xmlBuilder.XMLElement = xmlBuilder.create(signedInfoNode, {headless: true});
      const signedInfoXml = signedInfo_.end({pretty: false});
      // console.log(signedInfoXml);
      // process.exit(0);


      let signature = {
        'Signature': {
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',

          // 'SignedInfo' is appended here
          'SignatureValue': {
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
            '#text': this.getSignatureValue(signingKey, signedInfoXml)
          },
          'KeyInfo': {
            '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
            'X509Data': {
              '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
              'X509Certificate': {
                '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',
                '#text': cleanedSigningCsr
              },
            }
          }
        }
      };

      // @ts-ignore
      signature["Signature"]["SignedInfo"] = signedInfoNode["SignedInfo"];
      // @ts-ignore
      certRequestObj.CertApplicationRequest["Signature"] = signature["Signature"];


      let xml_: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      const xml = xml_.end({pretty: true});

      console.log(xml);
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
