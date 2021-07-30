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
    return '';
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
