'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {CertApplicationRequestInterface} from '../interfaces';
import {Environment} from '../constants';
import {Base64EncodedSHA1Digest, Base64EncodeStr, OpenSSLGetSHA1Signature} from '../utils';
import * as moment from 'moment';


class CertApplicationRequest {

  private readonly firstTimeRequest: boolean;
  private crp: CertApplicationRequestInterface;

  constructor(firstTimeRequest: boolean, crp: CertApplicationRequestInterface) {
    this.firstTimeRequest = firstTimeRequest;
    this.crp = crp;
  }

  public async createXmlBody(): Promise<string | undefined> {
    try {

      const certRequestObj = {
        'CertApplicationRequest': {
          '@xmlns': 'http://op.fi/mlp/xmldata/',

          'CustomerId': this.crp.CustomerId,
          'Timestamp': this.crp.Timestamp, // 2012-12-13T12:12:12
          'Environment': this.crp.Environment,
          'SoftwareId': this.getSoftwareId(),
          'Command': this.crp.Command,
          // 'Compression': false,
          'Service': this.crp.Service,
          // 'ExecutionSerial': this.crp.ExecutionSerial,
          'Content': Base64EncodeStr(this.crp.Content), // Base64 encoded -----BEGIN CERTIFICATE REQUEST----- ...
          'TransferKey': this.crp.TransferKey === undefined ? '' : this.crp.TransferKey,
        }
      };

      /*
      if (!this.firstTimeRequest && this.crp.SigningPrivateKey !== undefined) {
        // Calculate digest from request elements
        const requestXml = xml.end({pretty: true}); // before adding signature have to calculate digest
        const digest = Base64EncodedSHA1Digest(requestXml);

        const outFileName = 'sha1.sign';
        const signatureValue = await OpenSSLGetSHA1Signature(outFileName, this.crp.SigningPrivateKey, requestXml);

        // Signature elements
        xml.ele('ds:Signature', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:SignedInfo', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#"'})
          .ele('ds:CanonicalizationMethod', {
            Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
            'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'
          }).up()
          .ele('ds:SignatureMethod', {
            Algorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
            'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'
          }).up()
          .ele('ds:Reference', {URI: '', 'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:Transforms', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:Transform', {
            Algorithm: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'
          }).up()
          .up()
          .ele('ds:DigestMethod', {
            Algorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
            'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'
          }).up()
          .ele('ds:DigestValue', digest, {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .up()
          .up()
          .ele('ds:SignatureValue', signatureValue, {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .ele('ds:KeyInfo', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:X509Data', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:X509SubjectName', 'ok_value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .ele('ds:X509Certificate', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .up()
          .ele('ds:KeyValue', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
          .ele('ds:RSAKeyValue', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .ele('ds:Modulus', 'ok_value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .ele('ds:Exponent', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
          .up()
          .up()
          .up();
      }
      */

      let xml: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      return xml.end({pretty: true});
    } catch (e) {
      return undefined;
    }
  }

  private getSoftwareId(): string {
    return this.crp.SoftwareId.name + '-' + this.crp.SoftwareId.version;
  }

}

export {
  CertApplicationRequest
};
