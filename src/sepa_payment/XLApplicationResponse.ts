'use strict';

import {convertableToString, parseString} from 'xml2js';
import {XLFileDescriptor, XLInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {Base64DecodeStr, RemoveWhiteSpacesAndNewLines} from '../utils';
import {ApplicationRequestSignature} from '../signature';

class XLApplicationResponse {

  private readonly response: string;
  private readonly xl: XLInterface;

  constructor(xl: XLInterface, response: string) {
    this.xl = xl;
    this.response = response;
  }

  public async parseBody(): Promise<XLFileDescriptor> {
    // parse, handle application response envelope
    const envelopeXML: convertableToString = await this.parseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
    if (!envelopeValid) {
      throw {
        RequestId: this.xl.RequestId,
        Timestamp: this.xl.Timestamp,
        SoftwareId: this.xl.SoftwareId,
        error: new Error('XL response envelope did not pass signature verification')
      };
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];
    const getDownloadFileListOut = body[0]['cor:uploadFileout'];

    const encodedApplicationResponse = getDownloadFileListOut[0]['mod:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    const signature = new ApplicationRequestSignature();
    const validResponse = await signature.validateSignature(applicationResponseXML);
    if (!validResponse) {
      throw {
        RequestId: this.xl.RequestId,
        Timestamp: this.xl.Timestamp,
        SoftwareId: this.xl.SoftwareId,
        error: new Error('XL application response did not pass signature verification')
      };
    }

    // parse, handle response itself
    const xml: convertableToString = await this.parseXml(applicationResponseXML);

    const ns2CertApplicationResponse = xml['ApplicationResponse'];
    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    this.handleResponseCode(ResponseCode, ResponseText);


    const fd = ns2CertApplicationResponse['FileDescriptors'][0]['FileDescriptor'][0];
    return {
      FileReference: fd['FileReference'][0],
      TargetId: fd['TargetId'][0],
      FileType: fd['FileType'][0],
      FileTimestamp: fd['FileTimestamp'][0],
      Status: fd['Status'][0],
      AmountTotal: fd['AmountTotal'][0],
      TransactionCount: fd['TransactionCount'][0],
      Deletable: fd['Deletable'][0],
    };
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
  XLApplicationResponse
};
