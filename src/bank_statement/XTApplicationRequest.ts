'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {XTInterface} from '../interfaces';
import {Base64DecodeStr, CleanUpCertificate, LoadFileFromPath} from '../utils';
import {createHash, createSign} from "crypto";


/**
 * Bank statement
 * camt.053.001.02
 */
class XTApplicationRequest {

  private xt: XTInterface;

  constructor(xt: XTInterface) {
    this.xt = xt;
  }

  public async createXmlBody(): Promise<string> {
    if (this.xt.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xt.Base64EncodedClientPrivateKey);
    const csr = await LoadFileFromPath(this.xt.CsrPath, 'utf-8');
    const cleanedSigningCsr = CleanUpCertificate(csr);

    let obj: any = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://www.w3.org/2001/XMLSchema-instance',
        'CustomerId': this.xt.userParams.customerId,
        'Command': 'DownloadFileList',
        'Timestamp': this.xt.Timestamp,
        'Environment': this.xt.userParams.environment,
        'TargetId': 'NONE',
        'ExecutionSerial': this.xt.ExecutionSerial,
        'Compression': false,
        'SoftwareId': this.getSoftwareId(),
        'FileType': 'XT',

        // 'Signature': '', append node here
      }
    };
    let tempRequest_: xmlBuilder.XMLElement = xmlBuilder.create(obj);
    const requestXml = tempRequest_.end({pretty: true});

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


    let signatureNode = {
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
    signatureNode["Signature"]["SignedInfo"] = signedInfoNode["SignedInfo"];
    // @ts-ignore
    obj.ApplicationRequest["Signature"] = signatureNode["Signature"];


    let xml_: xmlBuilder.XMLElement = xmlBuilder.create(obj, {version: '1.0', encoding: 'UTF-8'});
    const xml = xml_.end({pretty: true});

    console.log(xml);
    // process.exit(0);

    return xml;
  }

  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
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
  XTApplicationRequest
};
