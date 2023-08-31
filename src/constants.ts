const Commands = {
  uploadFile: 'UploadFile',
  downloadFileList: 'DownloadFileList',
  downloadFile: 'DownloadFile',
  deleteFile: 'DeleteFile',
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
  {name: 'WFP', description: 'Waiting for processing'},
  {name: 'WFC', description: 'Waiting for confirmation'},
  {name: 'FWD', description: 'Forwarded to processing'},
  {name: 'DLD', description: 'Downloaded'},
  {name: 'DEL', description: 'Deleted'},
  {name: 'NEW', description: 'New file'},
  {name: 'KIN', description: 'Key-in'},
];

const Domain: {[key: string]: string} = {
  'PMNT': 'Payments',
  'LDAS': 'Loans and deposits', 
  'CAMT': 'Cash Management', 
  'ACMT': 'Account Management', 
  'XTND': 'Entended Domain', 
  'SECU': 'Securities', 
  'FORX': 'Foreign Exchange', 
  'NTAV': 'Not available'
};

const FamilyCode: {[key: string]: string} = {
  'RCDT': 'Received Credit Transfers',
  'ICDT': 'Issued Credit Transfers',
  'MCRD': 'Merchant Card Transaction',
  'IDDT': 'Issued Direct Debits',
  'RDDT': 'Received Direct Debits',
  'CCRD': 'Customer Card Transactions',
  'ICHQ': 'Issued Cheques',
  'RCHQ': 'Received Cheques',
  'MDOP': 'Miscellaneous Debit Operations',
  'MCOP': 'Miscellaneous Credit Operations',
  'ACCB': 'Account Balancing',
  'CASH': 'Miscellaneous Securities Operations',
  'CNTR': 'Counter transaction',
  'NTAV': 'Not available'
};

const SubFamilyCode: {[key: string]: string} = {
  'ESCT': 'SEPA Credit Transfer',
  'SALA': 'SEPA Credit Transfer / Sala',
  'DMCT': 'Domestic Credit Transfer',
  'INTR': 'Interest',
  'OTHR': 'Other',
  'RIMB': 'Reimbursement',
  'ESDD': 'SEPA direct debit service for consumers',
  'BBDD': 'SEPA B2B direct debit service',
  'UPDD': 'Unpaid Direct Debit',
  'STDO': 'Standing Order',
  'CHRG': 'Charges',
  'XBCT': 'Cross-Border Credit Transfer',
  'ZABA': 'Zero Balancing',
  'SWEP': 'Sweeping',
  'TOPG': 'Topping',
  'DVCA': 'Cash Dividends',
  'NTAV': 'Not available'
};

const CreditDebitIndicator: {[key: string]: string} = {
  'DBIT': 'Withdrawal',
  'CRDT': 'Deposit'
}
export {
  Commands,
  CreditDebitIndicator,
  Domain,
  FamilyCode,
  SubFamilyCode,
  FileTypes,
  PaymentInfoValidationStatus,
  StatusValues,
}
