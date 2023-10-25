import {
  Bank,
  Currency,
  Environment,
  PaymentMethod,
  ServiceLevel,
  Command,
  Language,
  Country,
  Code,
  BIC,
  Status, FileType, FileStatus
} from './types';

interface AxiosAgentInterface {
  ca?: string;
  rejectUnauthorized: boolean;
}

interface CreateCertificateInterface {
  twoLetterCountryCode: string;
  stateOrProvince: string;
  city: string;
  companyName: string;
  companyUnitName: string;
  customerId: string;
  emailAddress: string;
}

interface CreatedCertificateInterface {
  clientCertificate: string;
  clientPrivateKey: string;
}

/**
 * User environment params like secrets
 * used with each and every functionality
 */
interface UserParamsInterface {
  bank: Bank;
  environment: Environment;
  customerId: string;
  Base64EncodedRootCA: string | null;
  rejectUnauthorized: boolean;
}

/**
 * User software version params
 * meant to help with bug solving
 */
interface SoftwareIdInterface {
  name: string;
  version: string;
}


/**
 * Required parameters needed with application request signature
 */
interface ApplicationRequestSignatureInterface {
  requestXml: string;
  signingPrivateKey: string;
  X509Certificate?: string;
}


/**
 * Get certificate interface
 */
interface GetCertificateInterface {
  userParams: UserParamsInterface;
  requestUrl: string;
  CurrentWorkingDirectory?: string;
  Timestamp: string; // not in use with samlink but mandatory to be in schema
  SoftwareId: SoftwareIdInterface; // eases problem solving so good to specify
  Command: Command;
  ExecutionSerial?: string; // not in use with samlink
  Base64EncodedClientCsr: string;
  Base64EncodedBankCsr?: string;
  TransferKey?: string; // used in the first time request
  RequestId: string;
  Base64EncodedClientPrivateKey?: string; // used with renew certificate to sign xml with existing certificate
}

/**
 * Response certificate from get certificate methods
 * response stored in object which contains below fields
 */
interface CertificateInterface {
  Name: string | undefined;
  Certificate: string | undefined; // base64 encoded
  CertificateFormat: string | undefined;
  ExpirationDateTime: string | undefined;
}


/**
 * Get bank statement interface
 * camt.053.001.02
 */
interface XTInterface {
  userParams: UserParamsInterface;
  verifyResponseSignature: boolean;
  requestUrl: string;
  RequestId: string;
  Timestamp: string;
  SoftwareId: SoftwareIdInterface;
  ExecutionSerial: string;
  Base64EncodedBankCsr: string;
  Base64EncodedClientCsr: string;
  Base64EncodedClientPrivateKey?: string;
  language: Language;
}


interface XLPaymentInfoValidationInterface {
  PmtInf: SEPAPaymentInformationInterface[];
}

interface XLPaymentInfoValidationResultInterface {
  PmtInf: ValidationInfoInterface[];
}

interface ValidationInfoInterface {
  valid: boolean;
  errors: {
    code: number;
    status: string;
  }[];
}

/**
 * Definitions for XL SEPA message
 * Pain.001.001.03
 */
interface XLInterface {
  userParams: UserParamsInterface;
  requestUrl: string;
  RequestId: string;
  Timestamp: string;
  SoftwareId: SoftwareIdInterface;
  ExecutionSerial: string;
  Base64EncodedBankCsr: string;
  Base64EncodedClientCsr: string;
  Base64EncodedClientPrivateKey?: string;
  language: Language;
  sepa: {
    CcyOfTrf: Currency; // Currency of transfer
    GrpHdr: SEPAGroupHeaderInterface;
    PmtInf: SEPAPaymentInformationInterface[];
  };
}

interface SEPAGroupHeaderInterface {
  MsgId: string; // Message Identification
  CreDtTm: string; // Creation Date Time
  // NbOfTxs: number; // Number Of Transactions // comes from payment information array count at them moment
  InitgPty: {
    Nm: string;
    PstlAdr: {
      Ctry: Country;
      AdrLine: string;
      AdrLine2: string;
    },
    Id: {
      OrgId: {
        Othr: {
          Id: string;
          SchmeNm: {
            Cd: Code;
          }
        }
      }
    }
  }
}

interface SEPAPaymentInformationInterface {
  PmtInfId: string;
  PmtMtd: PaymentMethod;
  PmtTpInf: {
    SvcLvl: {
      Cd: Code;
    }
  },
  ReqdExctnDt: string,
  Dbtr: {
    Nm: string;
    PstlAdr: {
      Ctry: string;
      AdrLine: string;
      AdrLine2: string;
    },
    Id: {
      OrgId: {
        Othr: {
          Id: string;
          SchmeNm: {
            Cd: Code;
          }
        }
      }
    }
  },
  DbtrAcct: {
    Id: {
      IBAN: string;
    }
  },
  DbtrAgt: {
    FinInstnId: {
      BIC: BIC;
    }
  },
  ChrgBr: ServiceLevel;
  CdtTrfTxInf: {
    PmtId: {
      InstrId: string;
      EndToEndId: string;
    },
    PmtTpInf: {
      SvcLvl: {
        Cd: Code;
      }
    },
    Amt: {
      InstdAmt: string;
    },
    ChrgBr: ServiceLevel;
    CdtrAgt: {
      FinInstnId: {
        BIC: BIC;
      }
    },
    Cdtr: {
      Nm: string;
      PstlAdr: {
        Ctry: string;
        AdrLine: string;
        AdrLine2: string;
      },
      Id: {
        OrgId: {
          Othr: {
            Id: string;
            SchmeNm: {
              Cd: Code;
            }
          }
        }
      }
    },
    CdtrAcct: {
      Id: {
        IBAN: string;
      }
    },
    RmtInf: {
      Ustrd: string;
    }
  }
}


interface XLFileDescriptor {
  FileReference: string;
  TargetId: string;
  FileType: string;
  FileTimestamp: string;
  Status: Status;
  AmountTotal: string;
  TransactionCount: string;
  Deletable: string;
}


interface XPInterface {
  userParams: UserParamsInterface;
  verifyResponseSignature: boolean;
  requestUrl: string;
  RequestId: string;
  Timestamp: string;
  SoftwareId: SoftwareIdInterface;
  ExecutionSerial: string;
  Base64EncodedBankCsr: string;
  Base64EncodedClientCsr: string;
  Base64EncodedClientPrivateKey?: string;
  language: Language;
  fileStatus: FileStatus;
}


interface XPFileDescriptor {
  FileReference: string;
  TargetId: string;
  UserFilename: string;
  ParentFileReference: string | null;
  FileType: string;
  FileTimestamp: string;
  Status: string;
  ForwardedTimestamp: string;
  Deletable: string;
}

interface DFInterface {
  userParams: UserParamsInterface;
  verifyResponseSignature: boolean;
  requestUrl: string;
  RequestId: string;
  Timestamp: string;
  SoftwareId: SoftwareIdInterface;
  ExecutionSerial: string;
  Base64EncodedBankCsr: string;
  Base64EncodedClientCsr: string;
  Base64EncodedClientPrivateKey?: string;
  language: Language;
  fileType: FileType;
  fileReferences: string[];
}

interface DFFileDescriptor {
  FileReference: string;
  TargetId: string;
  UserFilename: string;
  ParentFileReference: string;
  FileType: string;
  FileTimestamp: string;
  Status: string;
  ForwardedTimestamp: string;
  Deletable: string;
  PaymentStatusReport: PaymentStatusReport | null;
  BankStatement: BankStatement | null;
}

interface CustomerPaymentStatusReport {
  // CstmrPmtStsRpt: {
  GrpHdr: {
    MsgId: string;
    CreDtTm: string;
    InitgPty: {
      Nm: string;
    },
    DbtrAgt: {
      FinInstnId: {
        BIC: string;
      }
    }
  },
  OrgnlGrpInfAndSts: {
    OrgnlMsgId: string;
    OrgnlMsgNmId: string;
    GrpSts: string;
  },
  OrgnlPmtInfAndSts: {
    OrgnlPmtInfId: string;
    TxInfAndSts: {
      OrgnlEndToEndId: string;
      TxSts: string;
      StsRsnInf: {
        Rsn: {
          Cd: string;
        },
        AddtlInf: string;
      }
    }
  }
//  }
}

interface PaymentStatusReportContent {
  GroupHeader: {
    MessageIdentifier: string;
    CreateDateTime: Date;
    InitiatingParty: {
      Name: string;
    },
    DebtorAgent: {
      FinancialInstitutionIdentification: {
        BIC: string;
      }
    }
  },
  OriginalGroupInformationAndStatus: {
    OriginalMessageIdentification: string;
    OriginalMessageNameIdentification: string;
    GroupStatus: string;
  },
  OriginalPaymentInformationAndStatus: {
    OriginalPaymentInformationIdentification: string;
    TransactionInformationAndStatus: {
      OriginalEndToEndIdentification: string;
      TransactionStatus: string;
      StatusReasonInformation: {
        Reason: {
          Code: string;
        },
        AdditionalInformation: string;
      }
    }
  }
}

interface PaymentStatusReport {
  CreateDateTime: Date;
  MessageIdentifier: string;
  OriginalMessageIdentification: string;
  OriginalPaymentInformationIdentification: string;
  Status: {
    GroupStatus: string;
    TransactionStatus: string,
    StatusReasonInformationDescriptions: string[];
    StatusReasonInformationCode: string;
    AdditionalInformation: string;
  }
}

interface XTFileDescriptor {
  FileReference: string;
  TargetId: string;
  UserFilename: string;
  FileType: string;
  FileTimestamp: string;
  Status: string;
  ForwardedTimestamp: string;
  Deletable: string;
}

interface BankStatement {
  groupHeader: {
    messageIdentification: string;
    creationDateTime: string;
  },
  statement: {
    statementId: string;
    legalSequenceNumber: string;
    creationDateTime: string;
    fromToDatetime: {
      fromDateTime: string;
      toDateTime: string;
    };
    account: {
      identification: {
        IBAN: string;
      };
      type: string;
      currency: string;
      ownerName: string;
      servicer: {
        financialInstitutionId: {
          BIC: string;
        }
      };
    },
    balance: BalanceEntry[];
    transactionSummary: {
      totalEntries: {
        numberOfEntries: number;
      };
      totalCreditEntries: {
        numberOfEntries: number;
        sum: number;
      };
      TotalDebitEntries: {
        numberOfEntries: number;
        sum: number;
      };
    };
    statementEntries: StatementEntry[];
  }
}

interface BalanceEntry {
  type: {
    codeOrProprietary: {
      code: string,
      desc: string
    }
  },
  creditLine: {
    included: boolean,
    amount: {
      value: string,
      currency: Currency
    }
  },
  amount: {
    value: string,
    currency: Currency
  },
  creditDebitIndicator: 'DBIT' | 'CRDT',
  date: string
}

interface StatementEntry {
  amount: any;
  creditDebitIndicator: any;
  status: any;
  bookingDate: any;
  valueDate: any;
  accountServicerReference: any;
  bankTransactionCode: any;
  entryDetails: StatementDetailEntry[];
}

interface StatementDetailEntry {
  transactionDetails: {
    references: {
      accountServicerReference: string;
    };
    amountDetails: {
      transactionAmount: {
        amount: {
          value: string;
          currency: string;
        };
      };
    };
    relatedParties?: RelatedPartiesInterface;
    remittanceInformation: {
      unstructured: string;
    };
    relatedDetails: {
      acceptanceDate: string;
    };
  };
}

interface RelatedPartiesInterface {
  type: string | null;
  name: string | null;
}

export {
  ApplicationRequestSignatureInterface,
  AxiosAgentInterface,
  CertificateInterface,
  CreateCertificateInterface,
  CreatedCertificateInterface,
  CustomerPaymentStatusReport,
  GetCertificateInterface,
  PaymentStatusReport,
  PaymentStatusReportContent,
  SEPAGroupHeaderInterface,
  SEPAPaymentInformationInterface,
  SoftwareIdInterface,
  UserParamsInterface,
  ValidationInfoInterface,
  XLFileDescriptor,
  XLInterface,
  XLPaymentInfoValidationInterface,
  XLPaymentInfoValidationResultInterface,
  XPFileDescriptor,
  XPInterface,
  XTInterface,
  DFInterface,
  DFFileDescriptor,
  XTFileDescriptor,
  BankStatement,
  StatementEntry,
  StatementDetailEntry,
  BalanceEntry,
  RelatedPartiesInterface,
}
