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
// @ts-ignore
import moment from 'moment';

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


  public mockResponse(): CertificateInterface {
    return {
      Name: 'SURNAME=' + this.gc.userParams.customerId + ', CN=MockCompany, O=<>, C=MockCountry',
      Certificate: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQzVUQ0NBYzBDQVFBd2daOHhDekFKQmdOVkJBWVRBa1pKTVJVd0V3WURWUVFJREF4VVpYTjBVSEp2ZG1sdQpZMlV4RVRBUEJnTlZCQWNNQ0ZSbGMzUkRhWFI1TVJrd0Z3WURWUVFLREJCVVpYTjBUM0puWVc1cGVtRjBhVzl1Ck1SVXdFd1lEVlFRTERBeFVaWE4wVlc1cGRFNWhiV1V4RVRBUEJnTlZCQU1NQ0RFeU16UTFOamM0TVNFd0h3WUoKS29aSWh2Y05BUWtCRmhKMFpYTjBhVzVuUUhSbGMzUnBibWN1Wm1rd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQQpBNElCRHdBd2dnRUtBb0lCQVFEVU91VkFHVEY3dzBZRDQ2MkJnQkFTOEp4V00rSXpWeEExV1hUUlpPNmVJWnJKCjArS1hONGUxZ1FpV1NIWGkvYzZmR1YzcExBNXJyWlA1bWpPT3JnQmk1RVNuZ01IeTJQYmZUNEJQZHY5elNvaUYKZ3ZrRkxpbXJBd2cwbjFNOUV5ajU3cFA2cEplQzdGUzhsTjgyODdZMkFTL3lUbGZSZXBVU21ncFE3WlRMclJMQwppZll0U3czaFp1d0lhT3JRQ2VWYmpmOFR2eVVPcTBYTElLNHRyRWZvZHpVRG4rOUI4TE5UYldPRE55TzlZd2U0CkdYdml2VG1uVldYaisvd2tWTk4wZ0ZybitsL0xYaHduTXJNYzkrMjdXWFFtOUg3S3ViZlh1UEs0SndHRjdoREoKa2h2aCtwR1hjWGQzTjhDR3ZGdGtqdTlvWks5VEFFaXd2WDY2MDY4M0FnTUJBQUdnQURBTkJna3Foa2lHOXcwQgpBUXNGQUFPQ0FRRUFxL3lZYjl5cXJ4Z0ZJYnRYcEhocG83bXhabXpMTndmWExGa25aR2JxTmFOdUZmKytKMENICklwZkI5cjgrL3RyQlFCUGl0OWcwOXRaV3ZFSGQrMy80bTR1dkQ5VzJwQ2xtWGZWZDlyZWFwSXUraHRGRlpBK3gKOGJ3cVNqNTk5cmN0cW5FL0prbjBtNWwxZTFSOEp5RExzV3JRcnBhdWV0RnZEdko0eGZObWttUmhVYm1DVWNWSgp1eStjRzlXUGVkQm9sWE92QjlmMXFELzJzbTMyeUF2S2hMSnZpMFZwRmFrT3RBdEdlS1BiUi9Jd0VmaVU1d1BZCnpkNzZCRTRYOE1xV1Rua2Z1L1RDaVNWY25EYkVjVFJDV1ZWdDY0bERaVlgwRGx1SXU3M01OOFdrYWZhbTVUbUkKVUx0Q1B1OVNTMHM4QmcvL2RIRUhuRURLNGU0MFBydUJPZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQ',
      CertificateFormat: 'X509',
      ExpirationDateTime: moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss'),
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
