'use strict';

// @ts-ignore
import * as xmlBuilder from 'xmlbuilder';
import {DFInterface} from '../interfaces';
import {Base64DecodeStr, CleanUpCertificate} from '../utils/utils';
import {ApplicationRequestSignature} from '../signature';
import {Commands} from '../constants';


class DFApplicationRequest {

  private df: DFInterface;

  constructor(df: DFInterface) {
    this.df = df;
  }

  public async createXmlBody(): Promise<string> {
    if (this.df.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.df.Base64EncodedClientPrivateKey);
    if (this.df.Base64EncodedBankCsr === undefined) {
      throw new Error('Base64EncodedBankCsr is undefined')
    }
    const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.df.Base64EncodedBankCsr));

    const obj = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://bxd.fi/xmldata/',
        'CustomerId': this.df.userParams.customerId,
        'Command': Commands.downloadFile,
        'Timestamp': this.df.Timestamp,
        'Environment': this.df.userParams.environment,
        'FileReferences': {
          'FileReference': [
            ...this.df.fileReferences
          ]
        },
        'Encryption': false,
        'Compression': false,
        'SoftwareId': this.getSoftwareId(),
        'FileType': this.df.fileType,
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

    return xml;
  }

  private getSoftwareId(): string {
    return this.df.SoftwareId.name + '-' + this.df.SoftwareId.version;
  }

}

export {
  DFApplicationRequest
};
