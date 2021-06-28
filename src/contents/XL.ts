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

  createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create('Document', {version: '1.0', encoding: 'utf-8'})
      .ele('pain.001.001.02')

      // Group header part of the message
      .ele('GrpHdr') // Group header
      .ele('MsgId', this.xl.GrpHdr.MsgId).up()
      .ele('CreDtTm', this.xl.GrpHdr.CreDtTm).up()
      .ele('Authstn', this.xl.GrpHdr.Authstn).up()
      .ele('BtchBookg', this.xl.GrpHdr.BtchBookg).up()
      .ele('NbOfTxs', this.xl.GrpHdr.NbOfTxs).up()
      .ele('CtrlSum', this.xl.GrpHdr.CtrlSum).up()
      .ele('Grpg', this.xl.GrpHdr.Grpg).up()
      .ele('InitgPty')
      .ele('Nm', this.xl.GrpHdr.InitgPty.Nm).up()
      .ele('PstlAdr')
      .ele('AdrTp', this.xl.GrpHdr.InitgPty.PstlAdr.AdrTp).up()
      .ele('AdrLine', this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine).up()
      .ele('StrtNm', this.xl.GrpHdr.InitgPty.PstlAdr.StrtNm).up()
      .ele('BldgNb', this.xl.GrpHdr.InitgPty.PstlAdr.BldgNb).up()
      .ele('PstCd', this.xl.GrpHdr.InitgPty.PstlAdr.PstCd).up()
      .ele('TwnNm', this.xl.GrpHdr.InitgPty.PstlAdr.TwnNm).up()
      .ele('CtrySubDvsn', this.xl.GrpHdr.InitgPty.PstlAdr.CtrySubDvsn).up()
      .ele('Ctry', this.xl.GrpHdr.InitgPty.PstlAdr.Ctry).up()
      .up()
      .ele('Id')
      .ele('OrgId')
      .ele('BIC', this.xl.GrpHdr.InitgPty.Id.OrgId.BIC).up()
      .ele('IBEI', this.xl.GrpHdr.InitgPty.Id.OrgId.IBEI).up()
      .ele('BEI', this.xl.GrpHdr.InitgPty.Id.OrgId.BEI).up()
      .ele('EANGLN', this.xl.GrpHdr.InitgPty.Id.OrgId.EANGLN).up()
      .ele('USCHU', this.xl.GrpHdr.InitgPty.Id.OrgId.USCHU).up()
      .ele('DUNS', this.xl.GrpHdr.InitgPty.Id.OrgId.DUNS).up()
      .ele('BkPtyId', this.xl.GrpHdr.InitgPty.Id.OrgId.BkPtyId).up()
      .ele('TaxIdNb', this.xl.GrpHdr.InitgPty.Id.OrgId.TaxIdNb).up()
      .ele('PrtryId')
      .ele('id', this.xl.GrpHdr.InitgPty.Id.OrgId.PrtryId.Id).up()
      .ele('Issr', this.xl.GrpHdr.InitgPty.Id.OrgId.PrtryId.Issr).up()
      .up()
      .up()
      .ele('CtryOfRes', this.xl.GrpHdr.InitgPty.CtryOfRes).up()
      .up()
      .up()
      .ele('FwdgAgt')
      .ele('FinInstnId')
      .ele('BIC', this.xl.GrpHdr.FwdgAgt.FinInstnId.BIC).up()
      .up()
      .ele('BrnchId')
      .ele('Id', this.xl.GrpHdr.FwdgAgt.BrnchId.Id).up()
      .ele('Nm', this.xl.GrpHdr.FwdgAgt.BrnchId.Nm).up()
      .ele('PstlAdr')
      .ele('AdrTp', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.AdrTp).up()
      .ele('AdrLine', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.AdrLine).up()
      .ele('StrtNm', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.StrtNm).up()
      .ele('BldgNb', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.BldgNb).up()
      .ele('PstCd', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.PstCd).up()
      .ele('TwnNm', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.TwnNm).up()
      .ele('CtrySubDvsn', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.CtrySubDvsn).up()
      .ele('Ctry', this.xl.GrpHdr.FwdgAgt.BrnchId.PstlAdr.Ctry).up()
      .up()

      // Payment info part of the message
      .ele('PmtInf').up()
      .ele('PmtInfId', '').up()
      .ele('PmtMtd', '').up()
      .ele('PmtTpInf')
      .ele('InstrPrty', '').up()




    return xml.end({pretty: true});
  }

}

export {
  XL
};
