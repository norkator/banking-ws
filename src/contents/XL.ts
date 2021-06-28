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
    /*
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
  <IntrmyAgt1Acct>
  <Id>
    <IBAN>str1234</IBAN>
    .up()
  <Tp>
  <Cd>CASH</Cd>
    .up()
  <Ccy>str1234</Ccy>
  <Nm>str1234</Nm>
    .up()
  <IntrmyAgt2>
  <FinInstnId>
    <BIC>str1234</BIC>
    .up()
  <BrnchId>
  <Id>str1234</Id>
  <Nm>str1234</Nm>
  <PstlAdr>
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
  <IntrmyAgt2Acct>
  <Id>
    <IBAN>str1234</IBAN>
    .up()
  <Tp>
  <Cd>CASH</Cd>
    .up()
  <Ccy>str1234</Ccy>
  <Nm>str1234</Nm>
    .up()
  <IntrmyAgt3>
  <FinInstnId>
    <BIC>str1234</BIC>
    .up()
  <BrnchId>
  <Id>str1234</Id>
  <Nm>str1234</Nm>
  <PstlAdr>
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
  <IntrmyAgt3Acct>
  <Id>
    <IBAN>str1234</IBAN>
    .up()
  <Tp>
  <Cd>CASH</Cd>
    .up()
  <Ccy>str1234</Ccy>
  <Nm>str1234</Nm>
    .up()
  <CdtrAgt>
  <FinInstnId>
    <BIC>str1234</BIC>
    .up()
  <BrnchId>
  <Id>str1234</Id>
  <Nm>str1234</Nm>
  <PstlAdr>
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
  <CdtrAgtAcct>
  <Id>
    <IBAN>str1234</IBAN>
    .up()
  <Tp>
  <Cd>CASH</Cd>
    .up()
  <Ccy>str1234</Ccy>
  <Nm>str1234</Nm>
    .up()
  <Cdtr>
  <Nm>str1234</Nm>
  <PstlAdr>
.ele('AdrTp', '').up()
  .ele('AdrLine', '').up()
  .ele('StrtNm', '').up()
  .ele('BldgNb', '').up()
  .ele('PstCd', '').up()
  .ele('TwnNm', '').up()
  .ele('CtrySubDvsn', '').up()
  .ele('Ctry', '').up()
    .up()
  <Id>
  <OrgId>
    <BIC>str1234</BIC>
  <IBEI>str1234</IBEI>
  <BEI>str1234</BEI>
  <EANGLN>str1234</EANGLN>
  <USCHU>str1234</USCHU>
  <DUNS>str1234</DUNS>
  <BkPtyId>str1234</BkPtyId>
  <TaxIdNb>str1234</TaxIdNb>
  <PrtryId>
  <Id>str1234</Id>
  <Issr>str1234</Issr>
    .up()
    .up()
    .up()
  <CtryOfRes>str1234</CtryOfRes>
    .up()
  <CdtrAcct>
  <Id>
    <IBAN>str1234</IBAN>
    .up()
  <Tp>
  <Cd>CASH</Cd>
    .up()
  <Ccy>str1234</Ccy>
  <Nm>str1234</Nm>
    .up()
  <UltmtCdtr>
  <Nm>str1234</Nm>
  <PstlAdr>
.ele('AdrTp', '').up()
  .ele('AdrLine', '').up()
  .ele('StrtNm', '').up()
  .ele('BldgNb', '').up()
  .ele('PstCd', '').up()
  .ele('TwnNm', '').up()
  .ele('CtrySubDvsn', '').up()
  .ele('Ctry', '').up()
    .up()
  <Id>
  <OrgId>
    <BIC>str1234</BIC>
  <IBEI>str1234</IBEI>
  <BEI>str1234</BEI>
  <EANGLN>str1234</EANGLN>
  <USCHU>str1234</USCHU>
  <DUNS>str1234</DUNS>
  <BkPtyId>str1234</BkPtyId>
  <TaxIdNb>str1234</TaxIdNb>
  <PrtryId>
  <Id>str1234</Id>
  <Issr>str1234</Issr>
    .up()
    .up()
    .up()
  <CtryOfRes>str1234</CtryOfRes>
    .up()
  <InstrForCdtrAgt>
  <Cd>CHQB</Cd>
  <InstrInf>str1234</InstrInf>
    .up()
  <InstrForDbtrAgt>str1234</InstrForDbtrAgt>
  <Purp>
  <Cd>str1234</Cd>
    .up()
  <RgltryRptg>
  <DbtCdtRptgInd>CRED</DbtCdtRptgInd>
  <Authrty>
  <AuthrtyNm>str1234</AuthrtyNm>
  <AuthrtyCtry>str1234</AuthrtyCtry>
    .up()
  <RgltryDtls>
  <Cd>str</Cd>
  <Amt Ccy="str1234">123.45</Amt>
  <Inf>str1234</Inf>
    .up()
    .up()
  <Tax>
  <CdtrTaxId>str1234</CdtrTaxId>
  <CdtrTaxTp>str1234</CdtrTaxTp>
  <DbtrTaxId>str1234</DbtrTaxId>
  <TaxRefNb>str1234</TaxRefNb>
  <TtlTaxblBaseAmt Ccy="str1234">123.45</TtlTaxblBaseAmt>
  <TtlTaxAmt Ccy="str1234">123.45</TtlTaxAmt>
  <TaxDt>2012-12-13</TaxDt>
  <TaxTpInf>
  <CertId>str1234</CertId>
  <TaxTp>
  <CtgyDesc>str1234</CtgyDesc>
  <Rate>123.45</Rate>
  <TaxblBaseAmt Ccy="str1234">123.45</TaxblBaseAmt>
  <Amt Ccy="str1234">123.45</Amt>
  .up()
  .up()
  .up()
  <RltdRmtInf>
  <RmtId>str1234</RmtId>
  <RmtLctnMtd>FAXI</RmtLctnMtd>
  <RmtLctnElctrncAdr>str1234</RmtLctnElctrncAdr>
  <RmtLctnPstlAdr>
  <Nm>str1234</Nm>
  <Adr>
  <AdrTp>ADDR</AdrTp>
  <AdrLine>str1234</AdrLine>
  <StrtNm>str1234</StrtNm>
  <BldgNb>str1234</BldgNb>
  <PstCd>str1234</PstCd>
  <TwnNm>str1234</TwnNm>
  <CtrySubDvsn>str1234</CtrySubDvsn>
  <Ctry>str1234</Ctry>
  .up()
  .up()
  .up()
<RmtInf>
<Ustrd>str1234</Ustrd>
<Strd>
<RfrdDocInf>
  <RfrdDocTp>
    <Cd>MSIN</Cd>
<Issr>str1234</Issr>
  .up()
<RfrdDocNb>str1234</RfrdDocNb>
  .up()
<RfrdDocRltdDt>2012-12-13</RfrdDocRltdDt>
<RfrdDocAmt>
<DuePyblAmt Ccy="str1234">123.45</DuePyblAmt>
    .up()
  <CdtrRefInf>
  <CdtrRefTp>
    <Cd>RADM</Cd>
  <Issr>str1234</Issr>
    .up()
  <CdtrRef>str1234</CdtrRef>
    .up()
  <Invcr>
  <Nm>str1234</Nm>
  <PstlAdr>
.ele('AdrTp', '').up()
  .ele('AdrLine', '').up()
  .ele('StrtNm', '').up()
  .ele('BldgNb', '').up()
  .ele('PstCd', '').up()
  .ele('TwnNm', '').up()
  .ele('CtrySubDvsn', '').up()
  .ele('Ctry', '').up()
    .up()
  <Id>
  <OrgId>
    <BIC>str1234</BIC>
  <IBEI>str1234</IBEI>
  <BEI>str1234</BEI>
  <EANGLN>str1234</EANGLN>
  <USCHU>str1234</USCHU>
  <DUNS>str1234</DUNS>
  <BkPtyId>str1234</BkPtyId>
  <TaxIdNb>str1234</TaxIdNb>
  <PrtryId>
  <Id>str1234</Id>
  <Issr>str1234</Issr>
    .up()
    .up()
    .up()
  <CtryOfRes>str1234</CtryOfRes>
    .up()
  <Invcee>
  <Nm>str1234</Nm>
  <PstlAdr>
.ele('AdrTp', '').up()
  .ele('AdrLine', '').up()
  .ele('StrtNm', '').up()
  .ele('BldgNb', '').up()
  .ele('PstCd', '').up()
  .ele('TwnNm', '').up()
  .ele('CtrySubDvsn', '').up()
  .ele('Ctry', '').up()
    .up()
  <Id>
  <OrgId>
    <BIC>str1234</BIC>
  <IBEI>str1234</IBEI>
  <BEI>str1234</BEI>
  <EANGLN>str1234</EANGLN>
  <USCHU>str1234</USCHU>
  <DUNS>str1234</DUNS>
  <BkPtyId>str1234</BkPtyId>
  <TaxIdNb>str1234</TaxIdNb>
  <PrtryId>
  <Id>str1234</Id>
  <Issr>str1234</Issr>
    .up()
    .up()
    .up()
  <CtryOfRes>str1234</CtryOfRes>
    .up()
  <AddtlRmtInf>str1234</AddtlRmtInf>
    .up()
    .up()

   */


    return xml.end({pretty: true});
  }

}

export {
  XL
};
