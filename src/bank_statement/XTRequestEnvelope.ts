'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment';
import {GetUuid} from '../utils';
import {XTInterface} from '../interfaces';
import {createHash, createSign} from 'crypto';

class XTRequestEnvelope {

  private xt: XTInterface;
  private readonly applicationRequest: string;
  private readonly timeStampUuid: string;
  private readonly bodyUuid: string;
  private readonly binarySecurityTokenUuid: string;

  constructor(xt: XTInterface, applicationRequest: string) {
    this.xt = xt;
    this.applicationRequest = applicationRequest;
    this.timeStampUuid = GetUuid('TS');
    this.bodyUuid = GetUuid('id');
    this.binarySecurityTokenUuid = GetUuid('X509');
  }

  public async createXmlBody(): Promise<string> {
    let obj: any = {
      'env:Envelope': {
        '@xmlns:env': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:bxd': 'http://model.bxd.fi',
        'env:Body': {
          '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
          '@wsu:Id': '',
          'cor:downloadFileListin': {
            '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
            'bxd:RequestHeader': {
              '@xmlns:bxd': 'http://model.bxd.fi',
              'bxd:SenderId': this.xt.userParams.customerId,
              'bxd:RequestId': this.xt.RequestId,
              'bxd:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
              'bxd:Language': this.xt.language,
              'bxd:UserAgent': this.getSoftwareId(),
              'bxd:ReceiverId': 'SAMLINK',
            },
            'ApplicationRequest': {
              '@xmlns:bxd': 'http://model.bxd.fi',
              '#text': this.applicationRequest,
            },
          }
        }
      }
    };

    const signatureNode = {};

    let xml: string = xmlBuilder.create(obj, {version: '1.0', encoding: 'UTF-8'}).end({pretty: true});

    // console.log(xml);
    // process.exit(0);

    return xml;
  }

  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
  }

  private static getCreated(): string {
    return moment().format('YYYY-MM-DDThh:mm:ssZ');
  }

  private static getExpires(): string {
    return moment().add(5, 'minutes').format('YYYY-MM-DDThh:mm:ssZ');
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
  XTRequestEnvelope
};
