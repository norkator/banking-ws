'use strict';

import {
  Base64DecodeStr,
  HandleResponseCode,
  ParseXml,
  RemoveWhiteSpacesAndNewLines,
  x509ExpirationDate
} from '../utils/utils';
import {CertificateInterface, GetCertificateInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';

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
    const envelopeXML: any = await ParseXml(this.response);

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
    const xml: any = await ParseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['CertApplicationResponse'];

    const customerId = ns2CertApplicationResponse['CustomerId'][0];
    if (customerId !== this.gc.userParams.customerId) {
      throw new Error('Customer id does not match with cert application response customer id');
    }

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    const Certificate = ns2CertApplicationResponse['Certificates'][0]['Certificate'][0];
    const cert = Certificate['Certificate'][0];
    const expiration = await CertApplicationResponse.getCertificateExpirationDate(cert);

    this.certificate = {
      Name: Certificate['Name'][0],
      Certificate: cert,
      CertificateFormat: Certificate['CertificateFormat'][0],
      ExpirationDateTime: expiration,
    };

    return this.certificate;
  }

  private static async getCertificateExpirationDate(cert: string): Promise<string> {
    const decoded = Base64DecodeStr(cert);

    return await x509ExpirationDate(decoded);
  }

}


export {
  CertApplicationResponse
};
