'use strict';

import * as moment from 'moment';
import {Base64DecodeStr, CleanUpCertificate, GetUuid} from '../utils';
import {XLInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';

class XLRequestEnvelope {

  private xl: XLInterface;
  private readonly applicationRequest: string;
  private readonly bodyUuid: string;

  constructor(xl: XLInterface, applicationRequest: string) {
    this.xl = xl;
    this.applicationRequest = applicationRequest;
    this.bodyUuid = GetUuid('B');
  }

  public async createXmlBody(): Promise<string> {
    if (this.xl.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xl.Base64EncodedClientPrivateKey);
    const binarySecurityToken = CleanUpCertificate(Base64DecodeStr(this.xl.Base64EncodedBankCsr));


    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'cor:uploadFilein': {
          'mod:RequestHeader': {
            'mod:SenderId': this.xl.userParams.customerId,
            'mod:RequestId': this.xl.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.xl.language,
            'mod:UserAgent': this.getSoftwareId(),
            'mod:ReceiverId': 'SAMLINK',
          },
          'mod:ApplicationRequest': {
            '#text': this.applicationRequest
          },
        },
      },
    };

    const envelopeSignature = new EnvelopeSignature();
    const xml = await envelopeSignature.constructEnvelopeWithSignature(
      bodyNode, this.bodyUuid, signingKey, binarySecurityToken
    );

    console.log(xml);
    process.exit(0);
    return xml;
  }


  private getSoftwareId(): string {
    return this.xl.SoftwareId.name + '-' + this.xl.SoftwareId.version;
  }


}

export {
  XLRequestEnvelope
};
