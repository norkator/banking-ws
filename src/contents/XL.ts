'use strict';

import * as moment from 'moment'
import * as xmlBuilder from 'xmlbuilder';
import {SoftwareIdInterface} from '../interfaces';
import {Environment, FileType, Operations, Status, StatusValues} from '../constants';


/**
 * SEPA-XML –bank transfer
 * pain.001.001.02
 */
class XL {

  test: string;

  constructor(test: string) {
    this.test = test;
  }

  createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create('Document', {version: '1.0', encoding: 'utf-8'})
      .ele('pain.001.001.02')
      .ele('GrpHdr') // Group header

      .ele('MsgId', '').up()
      .ele('CreDtTm', '').up()
      .ele('Authstn', '').up()
      .ele('BtchBookg', '').up()
      .ele('NbOfTxs', '').up()
      .ele('CtrlSum', '').up()
      .ele('Grpg', '').up()
      .ele('InitgPty')
      .ele('Nm', '').up()
      .ele('PstlAdr')
      .ele('AdrTp', '').up()
      .ele('AdrLine', '').up()
      .ele('StrtNm', '').up()
      .ele('BldgNb', '').up()
      .ele('PstCd', '').up()
      .ele('TwnNm', '').up()
      .ele('CtrySubDvsn', '').up()
      .ele('Ctry', '').up()
      .up()
      .ele('Id')
      .ele('OrgId')
      .ele('BIC', '').up()
      .ele('IBEI', '').up()
      .ele('BEI', '').up()
      .ele('EANGLN', '').up()
      .ele('USCHU', '').up()
      .ele('DUNS', '').up()
      .ele('BkPtyId', '').up()
      .ele('TaxIdNb', '').up()
      .ele('PrtryId')
      .ele('id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .up()
      .ele('FwdgAgt')

      .ele('FinInstnId')
      .ele('BIC', '').up()
      .up()
      .ele('BrnchId')
      .ele('Id', '').up()
      .ele('Nm', '').up()
      .ele('PstlAdr')
      .ele('AdrTp', '').up()
      .ele('AdrLine', '').up()
      .ele('StrtNm', '').up()
      .ele('BldgNb', '').up()
      .ele('PstCd', '').up()
      .ele('TwnNm', '').up()
      .ele('CtrySubDvsn', '').up()
      .ele('Ctry', '').up()
      .up()














      .ele('PmtInf').up()
    return xml.end({pretty: true});
  }

}

export {
  XL
};
