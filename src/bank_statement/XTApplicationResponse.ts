'use strict';

import {parseString} from 'xml2js';
import {Base64DecodeStr, RemoveWhiteSpacesAndNewLines} from '../utils';
import {XTInterface} from '../interfaces';
import {EnvelopeSignature} from "../envelopeSignature";

class XTApplicationResponse {

  private readonly response: string;
  private readonly xt: XTInterface;

  constructor(xt: XTInterface, response: string) {
    this.xt = xt;
    this.response = response;
  }

  public async parseBody(): Promise<string> {
    // parse, handle application response envelope
    const envelopeXML: any = await this.parseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(envelopeXML, this.xt.Base64EncodedClientPrivateKey);
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

    // parse, handle response itself
    const xml: any = await this.parseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['ApplicationResponse'];

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    this.handleResponseCode(ResponseCode, ResponseText);

    return applicationResponseXML;
  }


  private async parseXml(xmlString: string) {
    return await new Promise((resolve, reject) => parseString(xmlString, (err, jsonData) => {
      if (err) {
        reject(err);
      }
      resolve(jsonData);
    }));
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Since only '0' is successful, will throw error with every other and use its own response text
   * @param rc
   * @param responseText
   */
  private handleResponseCode(rc: string, responseText: string): void {
    if (rc === '5' || rc === '6' || rc === '7' || rc === '8' || rc === '12' || rc === '26' || rc === '30') {
      throw new Error(responseText);
    }
  }

}

export {
  XTApplicationResponse
};
