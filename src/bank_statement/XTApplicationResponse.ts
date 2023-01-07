'use strict';

import {Base64DecodeStr, HandleResponseCode, ParseXml, RemoveWhiteSpacesAndNewLines} from '../utils/utils';
import {XTInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';

class XTApplicationResponse {

  private readonly response: string;
  private readonly xt: XTInterface;

  constructor(xt: XTInterface, response: string) {
    this.xt = xt;
    this.response = response;
  }

  public async parseBody(): Promise<string> {
    // parse, handle application response envelope
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await ParseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
    if (!envelopeValid) {
      throw {
        RequestId: this.xt.RequestId,
        Timestamp: this.xt.Timestamp,
        SoftwareId: this.xt.SoftwareId,
        error: new Error('XT response envelope did not pass signature verification')
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
        RequestId: this.xt.RequestId,
        Timestamp: this.xt.Timestamp,
        SoftwareId: this.xt.SoftwareId,
        error: new Error('XT application response did not pass signature verification')
      };
    }

    // parse, handle response itself
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const xml: any = await ParseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['ApplicationResponse'];

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    return applicationResponseXML;
  }


}

export {
  XTApplicationResponse
};
