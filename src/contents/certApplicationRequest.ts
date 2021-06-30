'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {CertApplicationRequestInterface} from '../interfaces';
import {Environment} from '../constants';


class CertApplicationRequest {

  private crp: CertApplicationRequestInterface;

  constructor(crp: CertApplicationRequestInterface) {
    this.crp = crp;
  }

  public createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create(
      'CertApplicationRequest', {version: '1.0', encoding: 'utf-8'}
    );
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
    return xml.end({pretty: true});
  }

  private getSoftwareId(): string {
    return this.crp.SoftwareId.name + '-' + this.crp.SoftwareId.version;
  }

}

export {
  CertApplicationRequest
};
