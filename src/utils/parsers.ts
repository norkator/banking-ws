import { Base64DecodeStr, ParseXml } from './utils';
import { CustomerPaymentStatusReport, PaymentStatusReport } from '../interfaces';
import { ExtStatusCodes } from '../externalcodesets';

/**
 * Parses content from payment status report
 * @param contentInBase64
 * @constructor
 * @returns CustomerPaymentStatusReport
 */
async function ParseContentFromPaymentStatusReport(contentInBase64: string): Promise<CustomerPaymentStatusReport> {
  const a = await ParseXml(Base64DecodeStr(contentInBase64));
  const objectAtHand: CustomerPaymentStatusReport = a['Document']['CstmrPmtStsRpt'] as CustomerPaymentStatusReport;
  
  return objectAtHand
}

/**
 * Parses content from payment status report
 * @param contentInBase64
 * @constructor
 * @returns CustomerPaymentStatusReport
 */
 async function ParsePaymentStatusReport(statusReportObject: CustomerPaymentStatusReport): Promise<PaymentStatusReport> {

  let boolExtendedStatus;

  if (statusReportObject.hasOwnProperty('TxInfAndSts')){
    boolExtendedStatus = true;
  }

  const Description =  boolExtendedStatus ? ExtStatusCodes[statusReportObject.OrgnlPmtInfAndSts.TxInfAndSts.StsRsnInf.Rsn.Cd] : 'No Description.';
  
  const statusReport: PaymentStatusReport =  {
    CreateDateTime: new Date(statusReportObject.GrpHdr.CreDtTm),
    MessageIdentifier: statusReportObject.GrpHdr.MsgId,
    OriginalMessageIdentification: statusReportObject.OrgnlGrpInfAndSts.OrgnlMsgId,
    OriginalPaymentInformationIdentification: statusReportObject.OrgnlGrpInfAndSts.OrgnlMsgNmId,
    Status: {
      GroupStatus: statusReportObject.OrgnlGrpInfAndSts.GrpSts,
      TransactionStatus: boolExtendedStatus ? statusReportObject.OrgnlPmtInfAndSts.TxInfAndSts.TxSts : '-',
      StatusReasonInformationDescription: Description,
      StatusReasonInformationCode: boolExtendedStatus ? statusReportObject.OrgnlPmtInfAndSts.TxInfAndSts.StsRsnInf.Rsn.Cd : '-',
      AdditionalInformation: boolExtendedStatus ? statusReportObject.OrgnlPmtInfAndSts.TxInfAndSts.StsRsnInf.AddtlInf : '-'
    }
  }
  return statusReport
}

export { 
  ParseContentFromPaymentStatusReport,
  ParsePaymentStatusReport 
};
