'use strict';

// @ts-ignore
import * as xmlBuilder from 'xmlbuilder';
import {XLInterface} from '../interfaces';
import {Base64DecodeStr, Base64EncodeStr, CleanUpCertificate} from '../utils/utils';
import {ApplicationRequestSignature} from '../signature';
import {Commands, FileTypes} from '../constants';
import {XL} from './XL';


class XLApplicationRequest {

  private readonly xl: XLInterface;

  constructor(xl: XLInterface) {
    this.xl = xl;
  }

  public async createXmlBody(): Promise<string> {
    if (this.xl.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xl.Base64EncodedClientPrivateKey);
    if (this.xl.Base64EncodedBankCsr === undefined) {
      throw new Error('Base64EncodedBankCsr is undefined')
    }
    const bankCertificate = CleanUpCertificate(Base64DecodeStr(this.xl.Base64EncodedBankCsr));

    // Build up XL SEPA message
    const xl = new XL(this.xl);
    const xlContent = Base64EncodeStr(await xl.createSepaXmlMessage());

    const obj: any = {
      'ApplicationRequest': {
        '@xmlns': 'http://bxd.fi/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://bxd.fi/xmldata/',
        'CustomerId': this.xl.userParams.customerId,
        'Command': Commands.uploadFile,
        'Timestamp': this.xl.Timestamp,
        'Environment': this.xl.userParams.environment,
        'TargetId': 'NONE',
        'ExecutionSerial': this.xl.ExecutionSerial, // not in use
        'Compression': false,
        'AmountTotal': this.getAmountTotal(),
        'TransactionCount': this.xl.sepa.PmtInf.length, // this.xl.sepa.GrpHdr.NbOfTxs,
        'SoftwareId': this.getSoftwareId(),
        'CustomerExtension': '',
        'FileType': FileTypes.XL,
        'Content': {
          '#text': xlContent
        },
        // 'Signature': '',  node will be appended here
      }
    };

    const requestXml: string = xmlBuilder.create(obj).end({pretty: false});

    const ars = new ApplicationRequestSignature();
    const signature = await ars.createSignature({
      requestXml: requestXml,
      signingPrivateKey: signingKey,
      X509Certificate: bankCertificate
    });

    obj.ApplicationRequest['Signature'] = signature['Signature'];
    return xmlBuilder.create(obj).end({pretty: false});
  }

  private getSoftwareId(): string {
    return this.xl.SoftwareId.name + '-' + this.xl.SoftwareId.version;
  }

  // Todo check decimal requirements!
  private getAmountTotal(): number {
    let amountTotal = 0;
    for (const pmtInf of this.xl.sepa.PmtInf) {
      amountTotal = amountTotal + pmtInf.CdtTrfTxInf.Amt.InstdAmt;
    }
    return amountTotal;
  }

}

export {
  XLApplicationRequest
};
