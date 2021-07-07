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
    let xml: xmlBuilder.XMLElement = xmlBuilder.create('soapenv:Envelope');

    xml
      .ele('seapenv:Header').up()
      .ele('seapenv:Body')
      .ele('cer:getCertificatein')
      .ele('cer:RequestHeader')
      .ele('cer:SenderId', this.senderId).up()
      .ele('cer:RequestId', this.requestId).up()
      // @ts-ignore
      .ele('cer:Timestamp', new moment().format('YYYY-MM-DDThh:mm:ssZ'),).up()
      .up()
      .ele('cer:ApplicationRequest', this.applicationRequest)
      .up()
      .up()
      .up();

    return xml.end({pretty: true});
  }

}

export {
  CertRequestEnvelope
};
