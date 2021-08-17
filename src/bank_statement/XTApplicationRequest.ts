'use strict';

import {Base64DecodeStr, CleanUpCertificate} from '../utils';
import {ApplicationRequestSignature} from '../signature';
import {XTInterface} from '../interfaces';
import * as xmlBuilder from 'xmlbuilder';
import {Commands, FileTypes} from '../constants';


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
    if (this.xt.Base64EncodedBankCsr === undefined) {
      throw new Error('Base64EncodedBankCsr is undefined')
    }
    const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.xt.Base64EncodedBankCsr));


    let obj: any = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://bxd.fi/xmldata/',
        'CustomerId': this.xt.userParams.customerId,
        'Command': Commands.downloadFileList,
        'Timestamp': this.xt.Timestamp,
        'Environment': this.xt.userParams.environment,
        'TargetId': 'NONE',
        'ExecutionSerial': this.xt.ExecutionSerial,
        'Compression': false,
        'SoftwareId': this.getSoftwareId(),
        'FileType': FileTypes.XT,
        // 'Signature': '', append node here
      }
    };
    let requestXml: string = xmlBuilder.create(obj).end({pretty: false});

    const ars = new ApplicationRequestSignature();
    const signature = await ars.createSignature({
      requestXml: requestXml,
      signingPrivateKey: signingKey,
      X509Certificate: bankCertificate
    });

    // @ts-ignore
    obj.ApplicationRequest['Signature'] = signature['Signature'];
    // noinspection UnnecessaryLocalVariableJS
    let xml: string = xmlBuilder.create(obj).end({pretty: false});

    // console.log(xml);
    // fs.writeFileSync('signed.xml', xml)
    // process.exit(0);

    return xml;
  }

  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
  }


}

export {
  XTApplicationRequest
};
