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
    let xml: xmlBuilder.XMLElement = xmlBuilder.create('soapenv:Envelope', {});

    xml
      .ele('seapenv:Header').up()
      .ele('seapenv:Body', {})
      .ele('opc:getCertificatein')
      .ele('opc:RequestHeader')
      .ele('opc:SenderId', this.senderId).up()
      .ele('opc:RequestId', this.requestId).up()
      .ele('opc:Timestamp', moment().format('YYYY-MM-DDThh:mm:ssZ'),).up()
      .up()
      .ele('opc:ApplicationRequest', this.applicationRequest)
      .up()
      .up()
      .up();

    return xml.end({pretty: true});
  }

}

export {
  CertRequestEnvelope
};
