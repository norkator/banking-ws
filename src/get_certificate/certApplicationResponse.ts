'use strict';

import {parseString} from 'xml2js';
import {Base64DecodeStr, RemoveWhiteSpacesAndNewLines, x509ExpirationDate} from '../utils';
import {CertificateInterface, GetCertificateInterface} from '../interfaces';
import {EnvelopeSignature} from "../envelopeSignature";
import {ApplicationRequestSignature} from "../signature";

class CertApplicationResponse {

  private readonly gc: GetCertificateInterface;
  private readonly response: string;

  private certificate: CertificateInterface = {
    Name: undefined,
    Certificate: undefined,
    CertificateFormat: undefined,
    ExpirationDateTime: undefined
  };

  constructor(gc: GetCertificateInterface, response: string) {
    this.gc = gc;
    this.response = response;
  }

  public async parseBody(): Promise<CertificateInterface> {
    // parse, handle application response envelope
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await this.parseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
    if (!envelopeValid) {
      throw {
        RequestId: this.gc.RequestId,
        Timestamp: this.gc.Timestamp,
        SoftwareId: this.gc.SoftwareId,
        error: new Error('Cert application request envelope did not pass signature verification')
      };
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];
    const getCertificateOut = body[0]['cer:getCertificateout'];
    const encodedApplicationResponse = getCertificateOut[0]['cer:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    const signature = new ApplicationRequestSignature();
    const validResponse = await signature.validateSignature(applicationResponseXML);
    if (!validResponse) {
      throw {
        RequestId: this.gc.RequestId,
        Timestamp: this.gc.Timestamp,
        SoftwareId: this.gc.SoftwareId,
        error: new Error('Cert application response did not pass signature verification')
      };
    }

    // parse, handle response itself
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const xml: any = await this.parseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['CertApplicationResponse'];

    const customerId = ns2CertApplicationResponse['CustomerId'][0];
    if (customerId !== this.gc.userParams.customerId) {
      throw new Error('Customer id does not match with cert application response customer id');
    }

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    CertApplicationResponse.handleResponseCode(ResponseCode, ResponseText);


    const Certificate = ns2CertApplicationResponse['Certificates'][0]['Certificate'][0];
    const cert = Certificate['Certificate'][0];
    this.certificate = {
      Name: Certificate['Name'][0],
      Certificate: cert,
      CertificateFormat: Certificate['CertificateFormat'][0],
      ExpirationDateTime: await CertApplicationResponse.getCertificateExpirationDate(cert)
    };

    return this.certificate;
  }

  private async parseXml(xmlString: string): Promise<JSON> {
    return await new Promise((resolve, reject) => parseString(xmlString, (err, jsonData) => {
      if (err) {
        reject(err);
      }
      resolve(jsonData);
    }));
  }

  /**
   * Since only '0' is successful, will throw error with every other and use its own response text
   * @param rc
   * @param responseText
   */
  private static handleResponseCode(rc: string, responseText: string): void {
    if (rc === '5' || rc === '6' || rc === '7' || rc === '8' || rc === '12' || rc === '26' || rc === '30') {
      throw new Error(responseText);
    }
  }


  private static async getCertificateExpirationDate(cert: string): Promise<string> {
    const decoded = Base64DecodeStr(cert);
    return await x509ExpirationDate(decoded);
  }

}


export {
  CertApplicationResponse
};
