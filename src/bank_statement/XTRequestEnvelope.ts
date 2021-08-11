'use strict';

import * as moment from 'moment';
import {Base64DecodeStr, CleanUpCertificate, GetUuid} from '../utils';
import {XTInterface} from '../interfaces';
import {EnvelopeSignature} from "../envelopeSignature";

class XTRequestEnvelope {

  private xt: XTInterface;
  private readonly applicationRequest: string;
  private readonly bodyUuid: string;

  constructor(xt: XTInterface, applicationRequest: string) {
    this.xt = xt;
    this.applicationRequest = applicationRequest;
    this.bodyUuid = GetUuid('B');
  }

  public async createXmlBody(): Promise<string> {
    if (this.xt.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xt.Base64EncodedClientPrivateKey);
    const binarySecurityToken = CleanUpCertificate(Base64DecodeStr(this.xt.Base64EncodedBankCsr));


    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'cor:downloadFileListin': {
          'mod:RequestHeader': {
            'mod:SenderId': this.xt.userParams.customerId,
            'mod:RequestId': this.xt.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.xt.language,
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

    // console.log(xml);
    // process.exit(0);

    return xml;
  }


  private getSoftwareId(): string {
    return this.xt.SoftwareId.name + '-' + this.xt.SoftwareId.version;
  }


}

export {
  XTRequestEnvelope
};
