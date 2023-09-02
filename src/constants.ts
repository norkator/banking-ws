const Commands = {
  deleteFile: 'DeleteFile',
  downloadFile: 'DownloadFile',
  downloadFileList: 'DownloadFileList',
  uploadFile: 'UploadFile',
};

const FileTypes = {
  XL: 'XL', // pain.001.001.02 ja .03 | SEPA-XML –tilisiirto (lähetys)
  XP: 'XP', // SEPA-XML -virhepalaute (nouto) | pain.002.001.02 ja .03
  XT: 'XT', // XML-tiliote (nouto) | camt.053.001.02
};

const PaymentInfoValidationStatus = {
  valid: {
    code: 1,
    status: 'valid'
  },
}

const StatusValues = [
  {name: 'DEL', description: 'Deleted'},
  {name: 'DLD', description: 'Downloaded'},
  {name: 'FWD', description: 'Forwarded to processing'},
  {name: 'KIN', description: 'Key-in'},
  {name: 'NEW', description: 'New file'},
  {name: 'WFC', description: 'Waiting for confirmation'},
  {name: 'WFP', description: 'Waiting for processing'},
];

const Domain: {[key: string]: string} = {
  'ACMT': 'Account Management', 
  'CAMT': 'Cash Management', 
  'FORX': 'Foreign Exchange', 
  'LDAS': 'Loans and deposits', 
  'NTAV': 'Not available',
  'PMNT': 'Payments',
  'SECU': 'Securities', 
  'XTND': 'Entended Domain', 
};

const FamilyCode: {[key: string]: string} = {
  'ACCB': 'Account Balancing',
  'CASH': 'Miscellaneous Securities Operations',
  'CCRD': 'Customer Card Transactions',
  'CNTR': 'Counter transaction',
  'ICDT': 'Issued Credit Transfers',
  'ICHQ': 'Issued Cheques',
  'IDDT': 'Issued Direct Debits',
  'MCOP': 'Miscellaneous Credit Operations',
  'MCRD': 'Merchant Card Transaction',
  'MDOP': 'Miscellaneous Debit Operations',
  'NTAV': 'Not available',
  'RCDT': 'Received Credit Transfers',
  'RCHQ': 'Received Cheques',
  'RDDT': 'Received Direct Debits',
};

const SubFamilyCode: {[key: string]: string} = {
  'BBDD': 'SEPA B2B direct debit service',
  'CHRG': 'Charges',
  'DMCT': 'Domestic Credit Transfer',
  'DVCA': 'Cash Dividends',
  'ESCT': 'SEPA Credit Transfer',
  'ESDD': 'SEPA direct debit service for consumers',
  'INTR': 'Interest',
  'NTAV': 'Not available',
  'OTHR': 'Other',
  'RIMB': 'Reimbursement',
  'SALA': 'SEPA Credit Transfer / Sala',
  'STDO': 'Standing Order',
  'SWEP': 'Sweeping',
  'TOPG': 'Topping',
  'UPDD': 'Unpaid Direct Debit',
  'XBCT': 'Cross-Border Credit Transfer',
  'ZABA': 'Zero Balancing',
};

const CreditDebitIndicator: {[key: string]: string} = {
  'CRDT': 'Deposit',
  'DBIT': 'Withdrawal',
}

const CodeOrProprietary: {[key: string]: string} = {
  'CLAV': 'Available end balance including limit',
  'CLBD': 'Closing balance',
  'OPBD': 'Starting balance',
  'PRCD': 'End balance of previous period',
}

export {
  CodeOrProprietary,
  Commands,
  CreditDebitIndicator,
  Domain,
  FamilyCode,
  FileTypes,
  PaymentInfoValidationStatus,
  StatusValues,
  SubFamilyCode,
}
