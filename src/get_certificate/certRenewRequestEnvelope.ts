'use strict';

import * as xmlBuilder from 'xmlbuilder'
// @ts-ignore
import moment from 'moment';

class CertRenewRequestEnvelope {

  private readonly senderId: string;
  private readonly requestId: string;
  private readonly applicationRequest: string;

  constructor(senderId: string, requestId: string, applicationRequest: string) {
    this.senderId = senderId;
    this.requestId = requestId;
    this.applicationRequest = applicationRequest;
  }

  public createXmlBody(): string {
    const envelopeObject = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:opc': 'http://mlp.op.fi/OPCertificateService',
        'soapenv:Header': '',
        'soapenv:Body': {
          'opc:getCertificatein': {
            'opc:RequestHeader': {
              'opc:SenderId': this.senderId,
              'opc:RequestId': this.requestId,
              'opc:Timestamp': moment().format('YYYY-MM-DDThh:mm:ssZ')
            },
            'opc:ApplicationRequest': this.applicationRequest,
          },
        },
      }
    };

    const xml: string = xmlBuilder.create(envelopeObject).end({pretty: true});
    return xml;
  }

}

export {
  CertRenewRequestEnvelope
};
