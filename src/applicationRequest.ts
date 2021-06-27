'use strict';

/*
* Possibly helpful links:
* http://xsd2xml.com/https://github.com/oozcitak/xmlbuilder-js/wiki
*/

import * as moment from 'moment'
import * as xmlBuilder from 'xmlbuilder';
import {SoftwareIdInterface} from './interfaces';
import {Operations, StatusValues} from './constants';


class ApplicationRequest {

  customerId: string; // Web service customer id
  command: string; // command, same as SOAP operation
  startDate: string; // startDate, only needed with DownloadFileList command
  endDate: string; // endDate, only needed with DownloadFileList command
  status: string; // status, only needed with DownloadFileList command (StatusValues)
  fileReferences: String[]; // fileReferences, names of created files wanted to be queried
  userFilename: string; // userFilename, when uploading file, this is the name it will be created with
  compression: boolean; // compression, defined is CompressionMethod GZIP in use
  amountTotal: number; // amountTotal, amount to be sent, is read only if UploadFile and XL fileType in use
  transactionCount: number;
  softwareId: SoftwareIdInterface;
  fileType: string; // fileType, selected fileType from fileTypes

  constructor(customerId: string, command: string, startDate: string, endDate: string, status: string,
              fileReferences: String[], userFilename: string,
              compression: boolean, amountTotal: number, transactionCount: number,
              softwareId: SoftwareIdInterface, fileType: string
  ) {
    this.customerId = customerId;
    this.command = command;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.fileReferences = fileReferences;
    this.userFilename = userFilename;
    this.compression = compression;
    this.amountTotal = amountTotal;
    this.transactionCount = transactionCount;
    this.softwareId = softwareId;
    this.fileType = fileType;
  }

  createXmlBody(): string {
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

  getCustomerId(): string {
    return String(this.customerId);
  }

  getCommand(): string {
    return String(this.command);
  }

  getTimeStamp(): string {
    // @ts-ignore
    return new moment().format('YYYY-MM-DDThh:mm:ssZ');
  }

  getStartDate(): string {
    return this.command === Operations.downloadFileList ? this.startDate : '';
  }

  getEndDate(): string {
    return this.command === Operations.downloadFileList ? this.endDate : '';
  }

  getStatus(): string {
    if (this.command === Operations.downloadFileList) {
      const c = Object.values(StatusValues).find((value) => {
        return value === this.status;
      });
      return c !== undefined && c.length > 0 ? this.status : '';
    } else {
      return '';
    }
  }

  getEnvironment(): string {
    return String(process.env.SP_WS_ENVIRONMENT);
  }

  getUserFilename() {
    return this.command === Operations.uploadFile ? this.userFilename : '';
  }

  getCompression() {
    return typeof this.compression === 'boolean' ? this.compression : false
  }

  getCompressionMethod() {
    return this.getCompression() ? 'GZIP' : ''
  }

  getAmountTotal() {
    return this.amountTotal;
  }

  getTransactionCount() {
    return this.command === Operations.uploadFile ? this.transactionCount : 0;
  }

  getSoftwareId() {
    return this.softwareId.name + '-' + this.softwareId.version;
  }

  getFileType() {
    return this.fileType;
  }

}

export {
  ApplicationRequest
};
