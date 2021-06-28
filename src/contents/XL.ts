'use strict';

import * as moment from 'moment'
import * as xmlBuilder from 'xmlbuilder';
import {SoftwareIdInterface, XLInterface} from '../interfaces';
import {Environment, FileType, Operations, Status, StatusValues} from '../constants';


/**
 * SEPA-XML –bank transfer
 * pain.001.001.02
 */
class XL {

  xl: XLInterface;

  constructor(xl: XLInterface) {
    this.xl = xl;
  }

  appendGroupHeaderElements(xml): xmlBuilder.XMLElement {
    // Group header part of the message
    return xml.ele('GrpHdr') // Group header
      .ele('MsgId', this.xl.GrpHdr.MsgId).up()
      .ele('CreDtTm', this.xl.GrpHdr.CreDtTm).up()
      .ele('Authstn', this.xl.GrpHdr.Authstn).up()
      .ele('NbOfTxs', this.xl.GrpHdr.NbOfTxs).up()

      .ele('InitgPty')
      .ele('Nm', this.xl.GrpHdr.InitgPty.Nm).up()
      .ele('PstlAdr')
      .ele('Ctry', this.xl.GrpHdr.InitgPty.PstlAdr.Ctry).up()
      .ele('AdrLine', this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine).up()
      .ele('AdrLine', this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine).up()
      .up()

      .ele('Id')
      .ele('OrgId')
      .ele('Othr')
      .ele('Id', 1234567890).up()
      .ele('SchmeNm')
      .ele('Cd', 'BANK').up()
      .up()
      .up()
      .up()

  }

  appendPaymentInfoElements(xml): xmlBuilder.XMLElement {
    // Payment info part of the message
    return xml
      .ele('PmtInf')
      .ele('PmtInfId', '').up()
      .ele('PmtMtd', '').up()
      .ele('PmtTpInf')
      .ele('SvcLvl')
      .ele('Cd', 'SEPA').up()
      .up()
      .up()
      .ele('ReqdExctnDt', '').up()
      .ele('Dbtr')
      .ele('Nm', '').up()
      .ele('PstlAdr')
      .ele('Ctry', '').up()
      .ele('AdrLine', '').up()
      .ele('AdrLine', '').up()
      .up()
      .ele('Id')
      .ele('OrgId')

      .ele('Othr')
      .ele('Id', '0987654321').up()
      .ele('SchmeNm')
      .ele('Cd', 'BANK').up()
      .up()
      .up()
      .up()
      .up()
      .up()
      .ele('CdtrAcct')
      .ele('Id')
      .ele('IBAN', 'AT123456789012345678').up()
      .up()
      .up()
      .ele('RmtInf')
      .ele('Ustrd', 'Invoices 123 and 321').up()
      .up()
      .up()

  }

  createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create('Document', {version: '1.0', encoding: 'utf-8'})
      .ele('CstmrCdtTrfInitn');
    xml = this.appendGroupHeaderElements(xml);
    xml = this.appendPaymentInfoElements(xml);
    return xml.end({pretty: true});
  }

}

export {
  XL
};
