'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {XLInterface} from '../interfaces';


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
      .ele('NbOfTxs', this.xl.GrpHdr.NbOfTxs).up()

      .ele('InitgPty')
      .ele('Nm', this.xl.GrpHdr.InitgPty.Nm).up()
      .ele('PstlAdr')
      .ele('Ctry', this.xl.GrpHdr.InitgPty.PstlAdr.Ctry).up()
      .ele('AdrLine', this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine).up()
      .ele('AdrLine', this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine2).up()
      .up()

      .ele('Id')
      .ele('OrgId')
      .ele('Othr')
      .ele('Id', this.xl.GrpHdr.InitgPty.Id.OrgId.Othr.Id).up()
      .ele('SchmeNm')
      .ele('Cd', this.xl.GrpHdr.InitgPty.Id.OrgId.Othr.SchmeNm.Cd).up()
      .up()
      .up()
      .up()
      .up()
      .up()
      .up()
  }

  appendPaymentInfoElements(xml): xmlBuilder.XMLElement {
    // Payment info part of the message
    return xml
      .ele('PmtInf')

      .ele('PmtInfId', this.xl.PmtInf.PmtInfId).up()
      .ele('PmtMtd', this.xl.PmtInf.PmtMtd).up()
      .ele('PmtTpInf')
      .ele('SvcLvl')
      .ele('Cd', this.xl.PmtInf.PmtTpInf.SvcLvl.Cd).up()
      .up()
      .up()
      .ele('ReqdExctnDt', this.xl.PmtInf.ReqdExctnDt).up()
      .ele('Dbtr')
      .ele('Nm', this.xl.PmtInf.Dbtr.Nm).up()
      .ele('PstlAdr')
      .ele('Ctry', this.xl.PmtInf.Dbtr.PstlAdr.Ctry).up()
      .ele('AdrLine', this.xl.PmtInf.Dbtr.PstlAdr.AdrLine).up()
      .ele('AdrLine', this.xl.PmtInf.Dbtr.PstlAdr.AdrLine2).up()
      .up()
      .ele('Id')
      .ele('OrgId')
      .ele('Othr')
      .ele('Id', this.xl.PmtInf.Dbtr.Id.OrgId.Othr.Id).up()
      .ele('SchmeNm')
      .ele('Cd', this.xl.PmtInf.Dbtr.Id.OrgId.Othr.SchmeNm.Cd).up()
      .up()
      .up()
      .up()
      .up()
      .up()
      .ele('DbtrAcct')
      .ele('Id')
      .ele('IBAN', this.xl.PmtInf.DbtrAcct.Id.IBAN).up()
      .up()
      .up()
      .ele('DbtrAgt')
      .ele('FinInstnId')
      .ele('BIC', this.xl.PmtInf.DbtrAgt.FinInstnId.BIC).up()
      .up()
      .up()
      .ele('ChrgBr', this.xl.PmtInf.ChrgBr).up()
      .ele('CdtTrfTxInf')
      .ele('PmtId')
      .ele('InstrId', this.xl.PmtInf.CdtTrfTxInf.PmtId.InstrId).up()
      .ele('EndToEndId', this.xl.PmtInf.CdtTrfTxInf.PmtId.EndToEndId).up()
      .up()
      .ele('PmtTpInf')
      .ele('SvcLvl')
      .ele('Cd', this.xl.PmtInf.PmtTpInf.SvcLvl.Cd).up()
      .up()
      .up()
      .ele('Amt')
      .ele('InstdAmt', this.xl.PmtInf.CdtTrfTxInf.Amt.InstdAmt, {Ccy: this.xl.CcyOfTrf}).up()
      .up()
      .ele('ChrgBr', this.xl.PmtInf.CdtTrfTxInf.ChrgBr).up()
      .ele('CdtrAgt')
      .ele('FinInstnId')
      .ele('BIC', this.xl.PmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC).up()
      .up()
      .up()
      .ele('Cdtr')
      .ele('Nm', this.xl.PmtInf.CdtTrfTxInf.Cdtr.Nm).up()
      .ele('PstlAdr')
      .ele('Ctry', this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.Ctry).up()
      .ele('AdrLine', this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine).up()
      .ele('AdrLine', this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine2).up()
      .up()
      .ele('Id')
      .ele('OrgId')
      .ele('Othr')
      .ele('Id', this.xl.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.Id).up()
      .ele('SchmeNm')
      .ele('Cd', this.xl.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.SchmeNm.Cd).up()
      .up()
      .up()
      .up()
      .up()
      .up()
      .ele('CdtrAcct')
      .ele('Id')
      .ele('IBAN', this.xl.PmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN).up()
      .up()
      .up()
      .ele('RmtInf')
      .ele('Ustrd', this.xl.PmtInf.CdtTrfTxInf.RmtInf.Ustrd).up()
      .up()
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
