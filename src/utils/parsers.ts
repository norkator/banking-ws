import {Base64DecodeStr, ParseXml, GetNested, GetExternalStatusCodeDescriptions} from './utils';
import {PaymentStatusReport} from '../interfaces';

/**
 * Parses content from payment status report
 * @param contentInBase64
 * @constructor
 * @returns CustomerPaymentStatusReport
 */
async function ParseContentFromPaymentStatusReport(contentInBase64: string): Promise<string> {
  const a = await ParseXml(Base64DecodeStr(contentInBase64));
  let b = JSON.stringify(a['Document']['CstmrPmtStsRpt']);
  b = b.replace(/[\[\]']+/g,''); // remove squarebrackets - no need for PaymentStatusReport

  return b
}

/**
 * Parses content from payment status report to consume at endpoint
 * @param statusReportObject
 * @constructor
 * @returns PaymentStatusReport
 */
 async function ParsePaymentStatusReport(statusReportObject: any): Promise<PaymentStatusReport> {
  statusReportObject = JSON.parse(statusReportObject);

  let boolExtendedStatus = false;

  if (GetNested((statusReportObject as object),'OrgnlPmtInfAndSts','TxInfAndSts')){
    boolExtendedStatus = true;
  }
  const Descriptions =  boolExtendedStatus ? GetExternalStatusCodeDescriptions(statusReportObject['OrgnlPmtInfAndSts']['TxInfAndSts']['StsRsnInf']['Rsn']['Cd']) : ['No Description.'];
  const statusReport: PaymentStatusReport =  {
    CreateDateTime: new Date(statusReportObject['GrpHdr']['CreDtTm']),
    MessageIdentifier: statusReportObject['GrpHdr']['MsgId'],
    OriginalMessageIdentification: statusReportObject['OrgnlGrpInfAndSts']['OrgnlMsgId'],
    OriginalPaymentInformationIdentification: statusReportObject['OrgnlGrpInfAndSts']['OrgnlMsgNmId'],
    Status: {
      GroupStatus: boolExtendedStatus ? '-' : statusReportObject['OrgnlGrpInfAndSts']['GrpSts'],
      TransactionStatus: boolExtendedStatus ? statusReportObject['OrgnlPmtInfAndSts']['TxInfAndSts']['TxSts'] : '-',
      StatusReasonInformationDescriptions: Descriptions,
      StatusReasonInformationCode: boolExtendedStatus ? statusReportObject['OrgnlPmtInfAndSts']['TxInfAndSts']['StsRsnInf']['Rsn']['Cd'] : '-',
      AdditionalInformation: boolExtendedStatus ? statusReportObject['OrgnlPmtInfAndSts']['TxInfAndSts']['StsRsnInf']['AddtlInf'] : '-'
    }
  }

  return statusReport
}


async function ParseBankStatement(contentInBase64: string): Promise<any> {
  const a = await ParseXml(Base64DecodeStr(contentInBase64));
   // todo bank statement parsing here
   return null;
}


export {
  ParseContentFromPaymentStatusReport,
  ParsePaymentStatusReport,
  ParseBankStatement,
};
