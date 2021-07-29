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
    const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);
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

      let tempRequest_: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      const requestXml = tempRequest_.end({pretty: true});

      // console.log(requestXml)
      // process.exit(0);

      const signedInfoNode = {
        'SignedInfo': {
          'CanonicalizationMethod': {
            '@Algorithm': 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments'
          },
          'SignatureMethod': {
            '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
          },
          'Reference': {
            '@URI': '',
            'Transforms': {
              'Transform': {
                '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
              }
            },
            'DigestMethod': {
              '@Algorithm': 'http://www.w3.org/2000/09/xmldsig#sha1'
            },
            'DigestValue': this.getDigestValue(requestXml),
          }
        },
      };

      const signedInfo_: xmlBuilder.XMLElement = xmlBuilder.create(signedInfoNode, {headless: true});
      const signedInfoXml = signedInfo_.end({pretty: true});
      // console.log(signedInfoXml);
      // process.exit(0);


      let signature = {
        'Signature': {
          '@xmlns': 'http://www.w3.org/2000/09/xmldsig#',

          // 'SignedInfo' is appended here
          'SignatureValue': this.getSignatureValue(signingKey, signedInfoXml),
          'KeyInfo': {
            'X509Data': {
              'X509Certificate': cleanedSigningCsr,
            }
          }
        }
      };

      signature["Signature"]["SignedInfo"] = signedInfoNode["SignedInfo"];
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
