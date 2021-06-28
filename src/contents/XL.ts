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
      .ele('PmtInf')
      .ele('PmtInfId', '').up()
      .ele('PmtMtd', '').up()
      .ele('PmtTpInf')
      .ele('InstrPrty', '').up()
      .ele('SvcLvl')
      .ele('Cd', '').up()
      .up()
      .ele('LclInstrm')
      .ele('Cd', '').up()
      .up()
      .ele('CtgyPurp', '')
      .up()
      .ele('ReqdExctnDt', '').up()
      .ele('PoolgAdjstmntDt', '').up()

      .ele('Dbtr')
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
      .ele('PrtryId', '')
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()

      .ele('DbtrAcct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()

      .ele('DbtrAgt')
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
      .up()
      .up()

      .ele('DbtrAgtAcct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      
      .ele('UltmtDbtr')
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
      .ele('PrtryId', '')
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()

      .ele('ChrgBr', '').up()

      .ele('ChrgsAcct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()

      .ele('ChrgsAcctAgt')
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

      .ele('CdtTrfTxInf')
      .ele('PmtId')
      .ele('InstrId', '').up()
      .ele('EndToEndId', '').up()
      .up()


      .ele('PmtTpInf')
      .ele('InstrPrty', 'HIGH').up()
      .ele('SvcLvl')
      .ele('Cd', 'SEPA').up()
      .up()
      .ele('LclInstrm')
      .ele('Cd', '').up()
      .up()
      .ele('CtgyPurp', 'CORT').up()
      .up()
      .ele('Amt')
      .ele('InstdAmt', 123.45, {Ccy: 'EUR'}).up()
      .up()
      .ele('XchgRateInf')
      .ele('XchgRate', 123.45).up()
      .ele('RateTp', 'SPOT').up()
      .ele('CtrctId', '').up()
      .up()
      .ele('ChrgBr', 'DEBT').up()
      .ele('ChqInstr')
      .ele('ChqTp', 'CCHQ').up()
      .ele('ChqNb', '').up()
      .ele('ChqFr')
      .ele('Nm', '').up()
      .ele('Adr')
      .ele('AdrTp', '').up()
      .ele('AdrLine', '').up()
      .ele('StrtNm', '').up()
      .ele('BldgNb', '').up()
      .ele('PstCd', '').up()
      .ele('TwnNm', '').up()
      .ele('CtrySubDvsn', '').up()
      .ele('Ctry', '').up()
      .up()
      .up()
      .ele('DlvryMtd')
      .ele('Cd', '').up()
      .up()
      .ele('DlvrTo')
      .ele('Nm', '').up()
      .ele('Adr')
      .ele('AdrTp', '').up()
      .ele('AdrLine', '').up()
      .ele('StrtNm', '').up()
      .ele('BldgNb', '').up()
      .ele('PstCd', '').up()
      .ele('TwnNm', '').up()
      .ele('CtrySubDvsn', '').up()
      .ele('Ctry', '').up()
      .up()
      .up()
      .ele('InstrPrty', '').up()
      .ele('ChqMtrtyDt', '').up()
      .ele('FrmsCd', '').up()
      .ele('MemoFld', '').up()
      .ele('RgnlClrZone', '').up()
      .ele('PrtLctn', '').up()
      .up()
      .ele('UltmtDbtr')
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
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .ele('IntrmyAgt1')
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
      .up()
      .up()

      .ele('IntrmyAgt1Acct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      .ele('IntrmyAgt2')
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
      .up()
      .up()

      .ele('IntrmyAgt2Acct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      .ele('IntrmyAgt3')
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
      .up()
      .up()
      .ele('IntrmyAgt3Acct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      .ele('CdtrAgt')
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
      .up()
      .up()
      .ele('CdtrAgtAcct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      .ele('Cdtr')
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
      .ele('PrtryId').up()
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .ele('CdtrAcct')
      .ele('Id')
      .ele('IBAN', '').up()
      .up()
      .ele('Tp')
      .ele('Cd', '').up()
      .up()
      .ele('Ccy', '').up()
      .ele('Nm', '').up()
      .up()
      .ele('UltmtCdtr')
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
      .ele('PrtryId').up()
      .ele('Id', '').up()
      .ele('Issr', '').up()


      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .ele('InstrForCdtrAgt')
      .ele('Cd', '').up()
      .ele('InstrInf', '').up()
      .up()
      .ele('InstrForDbtrAgt', '').up()
      .ele('Purp')
      .ele('Cd', '').up()
      .up()
      .ele('RgltryRptg')
      .ele('DbtCdtRptgInd', '').up()
      .ele('Authrty')
      .ele('AuthrtyNm', '').up()
      .ele('AuthrtyCtry', '').up()
      .up()
      .ele('RgltryDtls')
      .ele('Cd', '').up()
      .ele('Amt', 123.45, {Ccy: 'str1234'}).up()
      .ele('Inf', '').up()
      .up()
      .up()
      .ele('Tax')
      .ele('CdtrTaxId', '').up()
      .ele('CdtrTaxTp', '').up()
      .ele('DbtrTaxId', '').up()
      .ele('TaxRefNb', '').up()
      .ele('TtlTaxblBaseAmt', 123.45, {Ccy: 'str1234'}).up()
      .ele('TtlTaxAmt', 123.45, {Ccy: 'str1234'}).up()
      .ele('TaxDt', '').up()
      .ele('TaxTpInf')
      .ele('CertId', '').up()
      .ele('TaxTp')
      .ele('CtgyDesc', '').up()
      .ele('Rate', '').up()
      .ele('TaxblBaseAmt', 123.45, {Ccy: 'str1234'}).up()
      .ele('Amt', 123.45, {Ccy: 'str1234'}).up()
      .up()
      .up()
      .up()

      .ele('RltdRmtInf')
      .ele('RmtId', '').up()
      .ele('RmtLctnMtd', '').up()
      .ele('RmtLctnElctrncAdr', '').up()
      .ele('RmtLctnPstlAdr')
      .ele('Nm', '').up()
      .ele('Adr')
      .ele('AdrTp', '').up()
      .ele('AdrLine', '').up()
      .ele('StrtNm', '').up()
      .ele('BldgNb', '').up()
      .ele('PstCd', '').up()
      .ele('TwnNm', '').up()
      .ele('CtrySubDvsn', '').up()
      .ele('Ctry', '').up()
      .up()
      .up()
      .up()
      .ele('RmtInf')
      .ele('Ustrd', '').up()
      .ele('Strd')
      .ele('RfrdDocInf')
      .ele('RfrdDocTp')
      .ele('Cd', '').up()
      .ele('Issr', '').up()
      .up()
      .ele('RfrdDocNb', '').up()
      .up()
      .ele('RfrdDocRltdDt', '').up()
      .ele('RfrdDocAmt')
      .ele('DuePyblAmt', 123.45, {Ccy: 'str1234'}).up()
      .up()
      .ele('CdtrRefInf')
      .ele('CdtrRefTp')
      .ele('Cd', '').up()
      .ele('Issr', '').up()
      .up()
      .ele('CdtrRef', '').up()
      .up()
      .ele('Invcr')
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
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .ele('Invcee')
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
      .ele('Id', '').up()
      .ele('Issr', '').up()
      .up()
      .up()
      .up()
      .ele('CtryOfRes', '').up()
      .up()
      .ele('AddtlRmtInf', '').up()
      .up()
      .up()
      */

    return xml.end({pretty: true});
  }

}

export {
  XL
};
