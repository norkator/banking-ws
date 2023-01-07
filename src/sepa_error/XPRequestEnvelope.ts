'use strict';

import * as moment from 'moment';
import {Base64DecodeStr, CleanUpCertificate, GetUuid} from '../utils/utils';
import {XPInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';

class XPRequestEnvelope {

  private xp: XPInterface;
  private readonly applicationRequest: string;
  private readonly bodyUuid: string;

  constructor(xp: XPInterface, applicationRequest: string) {
    this.xp = xp;
    this.applicationRequest = applicationRequest;
    this.bodyUuid = GetUuid('B');
  }

  public async createXmlBody(): Promise<string> {
    if (this.xp.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.xp.Base64EncodedClientPrivateKey);
    const binarySecurityToken = CleanUpCertificate(Base64DecodeStr(this.xp.Base64EncodedBankCsr));


    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'cor:downloadFileListin': {
          'mod:RequestHeader': {
            'mod:SenderId': this.xp.userParams.customerId,
            'mod:RequestId': this.xp.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.xp.language,
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
    return this.xp.SoftwareId.name + '-' + this.xp.SoftwareId.version;
  }


}

export {
  XPRequestEnvelope
};
