'use strict';

import {Base64DecodeStr, HandleResponseCode, ParseXml, RemoveWhiteSpacesAndNewLines} from '../utils';
import {XLFileDescriptor, XPInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';

class XPApplicationResponse {

  private readonly xp: XPInterface;
  private readonly response: string;

  constructor(xp: XPInterface, response: string) {
    this.xp = xp;
    this.response = response;
  }

  public async parseBody(): Promise<XLFileDescriptor> {
    // parse, handle application response envelope
    // eslint-disable-nexp-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await ParseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
    if (!envelopeValid) {
      throw {
        RequestId: this.xp.RequestId,
        Timestamp: this.xp.Timestamp,
        SoftwareId: this.xp.SoftwareId,
        error: new Error('XP response envelope did not pass signature verification')
      };
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];

    const getDownloadFileListOut = body[0]['cor:downloadFileListout'];

    const encodedApplicationResponse = getDownloadFileListOut[0]['mod:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    const signature = new ApplicationRequestSignature();
    const validResponse = await signature.validateSignature(applicationResponseXML);
    if (!validResponse) {
      throw {
        RequestId: this.xp.RequestId,
        Timestamp: this.xp.Timestamp,
        SoftwareId: this.xp.SoftwareId,
        error: new Error('XP application response did not pass signature verification')
      };
    }

    // parse, handle response itself
    // eslint-disable-nexp-line  @typescript-eslint/no-explicit-any
    const xml: any = await ParseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['ApplicationResponse'];

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    console.log(xml);
    process.exit(0);

    return undefined;
  }

}

export {
  XPApplicationResponse
};
