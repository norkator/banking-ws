'use strict';

import {Base64DecodeStr, CleanUpCertificate} from '../utils';
import {ApplicationRequestSignature} from '../signature';
import {FileReferencesInterface, STATUSInterface} from '../interfaces';
import * as xmlBuilder from 'xmlbuilder';
import {Commands} from '../constants';


class STATUSApplicationRequest {

  private readonly status: STATUSInterface;

  constructor(status: STATUSInterface) {
    this.status = status;
  }

  public async createXmlBody(): Promise<string> {
    if (this.status.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.status.Base64EncodedClientPrivateKey);
    if (this.status.Base64EncodedBankCsr === undefined) {
      throw new Error('Base64EncodedBankCsr is undefined')
    }
    const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.status.Base64EncodedBankCsr));

    const fileReferences = [];
    this.status.FileReferences.forEach((fr: FileReferencesInterface) => {
      fileReferences.push({
        'FileReference': fr.FileReference
      })
    });

    const obj = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://bxd.fi/xmldata/',
        'CustomerId': this.status.userParams.customerId,
        'Command': Commands.downloadFile,
        'Timestamp': this.status.Timestamp,
        'Environment': this.status.userParams.environment,
        'FileReferences': fileReferences,
        'Encryption': false,
        'Compression': false,
        'SoftwareId': this.getSoftwareId(),
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

    console.log(xml);
    // fs.writeFileSync('signed.xml', xml)
    process.exit(0);

    return xml;
  }

  private getSoftwareId(): string {
    return this.status.SoftwareId.name + '-' + this.status.SoftwareId.version;
  }


}

export {
  STATUSApplicationRequest
};
