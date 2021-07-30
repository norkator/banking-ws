'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {XTInterface} from '../interfaces';
import {Base64DecodeStr, CleanUpCertificate, LoadFileFromPath} from '../utils';


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

    const signatureNode = {};

    let xml: xmlBuilder.XMLElement = xmlBuilder.create(obj, {version: '1.0', encoding: 'UTF-8'});
    return xml.end({pretty: true});
  }

  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
  }

}

export {
  XTApplicationRequest
};
