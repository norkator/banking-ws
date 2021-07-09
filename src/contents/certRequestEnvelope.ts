'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment'

class CertRequestEnvelope {

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
        '@xmlns:opc': 'http://mlp.op.fi/OPCertificateService',
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'seapenv:Header': '',
        'seapenv:Body': {
          '@wsu:Id': 'id-3',
          '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
          'opc:getCertificatein': {
            'opc:RequestHeader': {
              'opc:SenderId': this.senderId,
              'opc:RequestId': this.requestId,
              // @ts-ignore
              'opc:Timestamp': new moment().format('YYYY-MM-DDThh:mm:ssZ')
            },
            'cer:ApplicationRequest': this.applicationRequest
          },
        },
      }
    };

    let xml: xmlBuilder.XMLElement = xmlBuilder.create(envelopeObject);
    return xml.end({pretty: true});
  }

}

export {
  CertRequestEnvelope
};
