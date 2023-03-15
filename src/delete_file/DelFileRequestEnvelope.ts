'use strict';

// @ts-ignore
import moment from 'moment';
import {Base64DecodeStr, CleanUpCertificate, GetUuid} from '../utils/utils';
import {DFInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';

class DelFileRequestEnvelope {

  private df: DFInterface;
  private readonly applicationRequest: string;
  private readonly bodyUuid: string;

  constructor(df: DFInterface, applicationRequest: string) {
    this.df = df;
    this.applicationRequest = applicationRequest;
    this.bodyUuid = GetUuid('B');
  }

  public async createXmlBody(): Promise<string> {
    if (this.df.Base64EncodedClientPrivateKey === undefined) {
      throw new Error('Base64EncodedClientPrivateKey cannot be undefined')
    }
    const signingKey = Base64DecodeStr(this.df.Base64EncodedClientPrivateKey);
    const binarySecurityToken = CleanUpCertificate(Base64DecodeStr(this.df.Base64EncodedBankCsr));


    const bodyNode = {
      'soapenv:Body': {
        '@xmlns:cor': 'http://bxd.fi/CorporateFileService',
        '@xmlns:mod': 'http://model.bxd.fi',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@wsu:Id': this.bodyUuid,
        'cor:downloadFilein': {
          'mod:RequestHeader': {
            'mod:SenderId': this.df.userParams.customerId,
            'mod:RequestId': this.df.RequestId,
            'mod:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ'),
            'mod:Language': this.df.language,
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

    return xml;
  }

  private getSoftwareId(): string {
    return this.df.SoftwareId.name + '-' + this.df.SoftwareId.version;
  }

}

export {
  DelFileRequestEnvelope
};
