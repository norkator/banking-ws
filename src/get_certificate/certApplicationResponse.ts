'use strict';

import {parseString, Builder} from 'xml2js';
import {Base64DecodeStr, RemoveWhiteSpacesAndNewLines} from '../utils';
import {CertificateInterface, GetCertificateInterface} from '../interfaces';
import {SignedXml, FileKeyInfo} from 'xml-crypto';
//const SignedXml = require('xml-crypto').SignedXml;
// const FileKeyInfo = require('xml-crypto').FileKeyInfo;

class CertApplicationResponse {

  private readonly response: string;
  private readonly customerId: string;
  private readonly csrPath: string;

  private certificate: CertificateInterface = {Name: undefined, Certificate: undefined, CertificateFormat: undefined};
  private isValidMessage: boolean = false;

  constructor(gc: GetCertificateInterface, response: string) {
    this.response = response;
    this.customerId = gc.userParams.customerId;
    this.csrPath = gc.CsrPath;
  }

  public async parseBody(): Promise<void> {
    // parse, handle application response envelope
    const envelopeXML: any = await this.parseXml(this.response);
    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];
    const getCertificateOut = body[0]['cer:getCertificateout'];
    const encodedApplicationResponse = getCertificateOut[0]['cer:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    // parse, handle response itself
    const xml: any = await this.parseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['CertApplicationResponse'];

    const customerId = ns2CertApplicationResponse['CustomerId'][0];
    if (customerId !== this.customerId) {
      throw new Error('Customer id does not match with cert application response customer id');
    }

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    CertApplicationResponse.handleResponseCode(ResponseCode, ResponseText);


    const Certificate = ns2CertApplicationResponse['Certificates'][0]['Certificate'][0];
    this.certificate = {
      Name: Certificate['Name'],
      Certificate: Certificate['Certificate'],
      CertificateFormat: Certificate['CertificateFormat'],
    };

    const Signature = ns2CertApplicationResponse['Signature'][0];
    const SignatureValue = Signature['SignatureValue'][0];
    // const KeyInfo = Signature['KeyInfo'];

    const builder = new Builder();
    this.verifySignature(applicationResponseXML, builder.buildObject(Signature), this.csrPath);
  }


  private verifySignature(xml: string, signature: string, csrPath: string): void {
    const sig = new SignedXml();

    sig.keyInfoProvider = new FileKeyInfo(csrPath);
    sig.loadSignature(signature);
    const res = sig.checkSignature(xml);
    if (!res) {
      console.log(sig.validationErrors);
      this.isValidMessage = false;
    } else {
      this.isValidMessage = true;
    }
  }

  public isValid(): boolean {
    return this.isValidMessage;
  }

  public getCertificate(): CertificateInterface {
    return this.certificate;
  }

  private async parseXml(xmlString: string) {
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


}

export {
  CertApplicationResponse
};
