import {Base64DecodeStr, ParseXml, GetNested, GetExternalStatusCodeDescriptions} from './utils';
import {BankStatement, PaymentStatusReport} from '../interfaces';

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


async function ParseBankStatement(contentInBase64: string): Promise<BankStatement> {
   const a = await ParseXml(Base64DecodeStr(contentInBase64));
   const BkToCstmrStmt = a['Document']['BkToCstmrStmt'][0]; // bank to customer statement

  return {
    groupHeader: {
      messageIdentification: BkToCstmrStmt['GrpHdr'][0]['MsgId'][0],
      creationDateTime: BkToCstmrStmt['GrpHdr'][0]['CreDtTm'][0],
    },
    statement: {
      statementId : BkToCstmrStmt['Stmt'][0]['Id'][0],
      legalSequenceNumber: BkToCstmrStmt['Stmt'][0]['LglSeqNb'][0],
      creationDateTime: BkToCstmrStmt['Stmt'][0]['CreDtTm'][0],

      fromToDatetime: {
        fromDateTime: BkToCstmrStmt['Stmt'][0]['FrToDt'][0]['FrDtTm'][0],
        toDateTime: BkToCstmrStmt['Stmt'][0]['FrToDt'][0]['ToDtTm'][0],
      },
      account: {
        identification: {
          IBAN: BkToCstmrStmt['Stmt'][0]['Acct'][0]['Id'][0]['IBAN'][0],
        },
        type: BkToCstmrStmt['Stmt'][0]['Acct'][0]['Tp'][0]['Cd'][0],
        currency: BkToCstmrStmt['Stmt'][0]['Acct'][0]['Ccy'][0],
        ownerName: BkToCstmrStmt['Stmt'][0]['Acct'][0]['Ownr'][0]['Nm'][0],
        servicer: {
          financialInstitutionId: {
            BIC: BkToCstmrStmt['Stmt'][0]['Acct'][0]['Svcr'][0]['FinInstnId'][0]['BIC'][0],
          },
        },
      },
      balance: BkToCstmrStmt['Stmt'][0]['Bal'],

      transactionSummary: {
        totalEntries: BkToCstmrStmt['Stmt'][0]['TxsSummry'][0]['TtlNtries'][0],
        totalCreditEntries: BkToCstmrStmt['Stmt'][0]['TxsSummry'][0]['TtlCdtNtries'][0],
        TotalDebitEntries: BkToCstmrStmt['Stmt'][0]['TxsSummry'][0]['TtlDbtNtries'][0],
      },
      statementEntry: BkToCstmrStmt['Stmt'][0]['Ntry'],
    }
  };
}


export {
  ParseContentFromPaymentStatusReport,
  ParsePaymentStatusReport,
  ParseBankStatement,
};
