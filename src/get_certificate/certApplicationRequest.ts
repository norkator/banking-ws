'use strict';

import {Base64DecodeStr, Base64EncodeStr, CleanUpCertificate} from '../utils/utils';
import {ApplicationRequestSignature} from '../signature';
import {GetCertificateInterface} from '../interfaces';
import * as xmlBuilder from 'xmlbuilder';


class CertApplicationRequest {

  private gc: GetCertificateInterface;

  constructor(gc: GetCertificateInterface) {
    this.gc = gc;
  }

  public async createXmlBody(): Promise<string | undefined> {
    const csr = Base64DecodeStr(this.gc.Base64EncodedClientCsr);

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const certRequestObj: any = {
      'CertApplicationRequest': {
        '@xmlns': 'http://op.fi/mlp/xmldata/',
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

      const xml: string = xmlBuilder.create(certRequestObj).end({pretty: true});
      // console.log(xml);
      // process.exit(0);

      return xml;
    }

    if (this.gc.Command === 'RenewCertificate') {
      if (this.gc.Base64EncodedClientPrivateKey === undefined) {
        throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
      }
      const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);
      if (this.gc.Base64EncodedBankCsr === undefined) {
        throw new Error('Base64EncodedBankCsr is undefined')
      }
      const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.gc.Base64EncodedBankCsr));

      const requestXml: string = xmlBuilder.create(certRequestObj).end({pretty: false});


      const ars = new ApplicationRequestSignature();
      const signature = await ars.createSignature({
        requestXml: requestXml,
        signingPrivateKey: signingKey,
        X509Certificate: bankCertificate
      });

      // @ts-ignore
      certRequestObj.CertApplicationRequest['Signature'] = signature['Signature'];
      // noinspection UnnecessaryLocalVariableJS
      const xml: string = xmlBuilder.create(certRequestObj).end({pretty: false});


      // console.log(xml);
      // fs.writeFileSync('signed.xml', xml)
      // process.exit(0);
      return xml;
    }

    return undefined;
  }

  private getSoftwareId(): string {
    return this.gc.SoftwareId.name + '-' + this.gc.SoftwareId.version;
  }

}

export {
  CertApplicationRequest
};
