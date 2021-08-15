'use strict';

/*
* Possibly helpful links:
* http://xsd2xml.com/https://github.com/oozcitak/xmlbuilder-js/wiki
*/

// @ts-ignore
import moment from 'moment';
import * as xmlBuilder from 'xmlbuilder';
import {XLInterface} from '../interfaces';
import {Environment, FileType, Status} from '../types';
import {Operations, StatusValues} from '../constants';


class XLApplicationRequest {

  private xl: XLInterface;

  constructor(xl: XLInterface) {
    this.xl = xl;
  }

  public createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create(
      'ApplicationRequest', {version: '1.0', encoding: 'utf-8'}
    )
      .ele('CustomerId', this.getCustomerId()).up()
      .ele('Command', this.getCommand()).up()
      .ele('Timestamp', this.getTimeStamp()).up()
      .ele('StartDate', this.getStartDate()).up()
      .ele('EndDate', this.getEndDate()).up()
      .ele('Status', this.getStatus()).up()
      .ele('ServiceId', '').up() // not in use
      .ele('Environment', this.getEnvironment).up()
      .ele('FileReferences');
    for (const reference of this.fileReferences) {
      xml = xml.ele('FileReference', reference).up()
    }
    xml = xml.up();
    xml = xml.ele('UserFilename', this.getUserFilename()).up()
      .ele('TargetId', '').up() // Todo, what is this? "Tuettu määritelmän mukaisesti."
      .ele('ExecutionSerial', '').up() // not in use
      .ele('Encryption', '').up() // not in use
      .ele('EncryptionMethod', '').up() // not in use
      .ele('Compression', this.getCompression()).up()
      .ele('CompressionMethod', this.getCompressionMethod()).up()
      .ele('AmountTotal', this.getAmountTotal()).up()
      .ele('TransactionCount', this.getTransactionCount()).up()
      .ele('SoftwareId', this.getSoftwareId()).up()
      .ele('CustomerExtension').up() // not in use
      .ele('FileType', this.getFileType()).up()
      .ele('Content', '').up() // Todo, populate!
      .ele('Signature', '').up(); // Todo, Kaikki sanomat tulee olla allekirjoitettuja W3C XML Signature- standardin mukaisesti
    return xml.end({pretty: true});
  }

  private getCustomerId(): string {
    return String(this.customerId);
  }

  private getCommand(): string {
    return String(this.command);
  }

  private getTimeStamp(): string {
    return moment().format('YYYY-MM-DDThh:mm:ssZ');
  }

  private getStartDate(): string {
    return this.command === Operations.downloadFileList ? this.startDate : '';
  }

  private getEndDate(): string {
    return this.command === Operations.downloadFileList ? this.endDate : '';
  }

  private getStatus(): Status {
    if (this.command === Operations.downloadFileList) {
      const c = Object.values(StatusValues).find((value) => {
        return value === this.status;
      });
      return c !== undefined && c.length > 0 ? this.status : '';
    } else {
      return '';
    }
  }

  private getEnvironment(): string {
    return String(this.environment);
  }

  private getUserFilename(): string {
    return this.command === Operations.uploadFile ? this.userFilename : '';
  }

  private getCompression(): boolean {
    return typeof this.compression === 'boolean' ? this.compression : false
  }

  private getCompressionMethod(): string {
    return this.getCompression() ? 'GZIP' : ''
  }

  private getAmountTotal(): number {
    return this.amountTotal;
  }

  private getTransactionCount(): number {
    return this.command === Operations.uploadFile ? this.transactionCount : 0;
  }

  private getSoftwareId(): string {
    return this.softwareId.name + '-' + this.softwareId.version;
  }

  private getFileType(): FileType {
    return this.fileType;
  }

}

export {
  XLApplicationRequest
};
