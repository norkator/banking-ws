'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {CertApplicationRequestInterface} from '../interfaces';
import {Environment} from '../constants';
import {Base64EncodedSHA1Digest, OpenSSLGetSHA1Signature} from '../utils';


class CertApplicationRequest {

  private crp: CertApplicationRequestInterface;

  constructor(crp: CertApplicationRequestInterface) {
    this.crp = crp;
  }

  public async createXmlBody(): Promise<string> {
    try {
      let xml: xmlBuilder.XMLElement = xmlBuilder.create(
        'CertApplicationRequest', {version: '1.0', encoding: 'utf-8'}
      );
      // Basic data elements
      xml.ele('CustomerId', this.crp.CustomerId).up()
        .ele('Timestamp', this.crp.Timestamp).up() // 2012-12-13T12:12:12
        .ele('Environment', this.crp.Environment).up()
        .ele('SoftwareId', this.getSoftwareId()).up()
        .ele('Command', this.crp.Command).up()
        // .ele('Encryption', true).up()
        // .ele('EncryptionMethod', 'str1234').up()
        .ele('Compression', false).up()
        // .ele('CompressionMethod', 'str1234').up()
        .ele('Service', this.crp.Service).up()
        .ele('ExecutionSerial', this.crp.ExecutionSerial).up()
        .ele('Content', this.crp.Content).up()
        .ele('TransferKey', this.crp.TransferKey === undefined ? '' : this.crp.TransferKey).up();
      // .ele('SerialNumber', 'str1234').up();

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
        .ele('ds:X509SubjectName', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
        .ele('ds:X509Certificate', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
        .up()
        .ele('ds:KeyValue', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'})
        .ele('ds:RSAKeyValue', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
        .ele('ds:Modulus', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
        .ele('ds:Exponent', 'value_here', {'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'}).up()
        .up()
        .up()
        .up();

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
