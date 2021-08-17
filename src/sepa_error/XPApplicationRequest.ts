'use strict';

// @ts-ignore
import * as xmlBuilder from 'xmlbuilder';
import {XPInterface} from '../interfaces';
import {Base64DecodeStr, CleanUpCertificate} from '../utils';
import {ApplicationRequestSignature} from '../signature';
import {Commands, FileTypes} from '../constants';


class XPApplicationRequest {

  private xp: XPInterface;

  constructor(xp: XPInterface) {
    this.xp = xp;
  }

  public async createXmlBody(): Promise<string> {
    if (this.xp.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xp.Base64EncodedClientPrivateKey);
    if (this.xp.Base64EncodedBankCsr === undefined) {
      throw new Error('Base64EncodedBankCsr is undefined')
    }
    const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.xp.Base64EncodedBankCsr));

    const obj = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://bxd.fi/xmldata/',
        'CustomerId': this.xp.userParams.customerId,
        'Command': Commands.downloadFileList,
        'Timestamp': this.xp.Timestamp,
        'Environment': this.xp.userParams.environment,
        'TargetId': 'NONE',
        'ExecutionSerial': this.xp.ExecutionSerial, // not in use
        'Compression': false,
        'SoftwareId': this.getSoftwareId(),
        'FileType': FileTypes.XP,
        // 'Signature': '', append node here
      }
    };

    const requestXml: string = xmlBuilder.create(obj).end({pretty: false});

    const ars = new ApplicationRequestSignature();
    const signature = await ars.createSignature({
      requestXml: requestXml,
      signingPrivateKey: signingKey,
      X509Certificate: bankCertificate
    });

    // @ts-ignore
    obj.ApplicationRequest['Signature'] = signature['Signature'];
    // noinspection UnnecessaryLocalVariableJS
    const xml: string = xmlBuilder.create(obj).end({pretty: false});

    // console.log(xml);
    // process.exit(0);
    return xml;
  }

  private getSoftwareId(): string {
    return this.xp.SoftwareId.name + '-' + this.xp.SoftwareId.version;
  }

}

export {
  XPApplicationRequest
};
