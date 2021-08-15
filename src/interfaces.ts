import {Bank, Currency, Environment, PaymentMethod, ServiceLevel, Command, Language} from './types';


export interface CreateCertificateInterface {
  twoLetterCountryCode: string;
  stateOrProvince: string;
  city: string;
  companyName: string;
  companyUnitName: string;
  customerId: string;
  emailAddress: string;
}

export interface CreatedCertificateInterface {
  clientCertificate: string;
  clientPrivateKey: string;
}

/**
 * User environment params like secrets
 * used with each and every functionality
 */
export interface UserParamsInterface {
  bank: Bank;
  environment: Environment;
  customerId: string;
  Base64EncodedRootCA: string;
}

/**
 * User software version params
 * meant to help with bug solving
 */
export interface SoftwareIdInterface {
  name: string;
  version: string;
}


/**
 * Required parameters needed with application request signature
 */
export interface ApplicationRequestSignatureInterface {
  requestXml: string;
  signingPrivateKey: string;
  X509Certificate?: string;
}


/**
 * Get certificate interface
 */
export interface GetCertificateInterface {
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
export interface CertificateInterface {
  Name: string | undefined;
  Certificate: string | undefined; // base64 encoded
  CertificateFormat: string | undefined;
  ExpirationDateTime: string | undefined;
}


/**
 * Get bank statement interface
 * camt.053.001.02
 */
export interface XTInterface {
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
}


/**
 * Definitions for XL SEPA message
 * pain.001.001.02
 */
export interface XLInterface {
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
  StartDate: string;
  EndDate: string;
  Status: string;
  UserFilename: string;
  AmountTotal: string;
  TransactionCount: number;
  sepa: {
    CcyOfTrf: Currency; // Currency of transfer
    GrpHdr: { // Group Header
      MsgId: string; // Message Identification
      CreDtTm: string; // Creation Date Time
      NbOfTxs: number; // Number Of Transactions
      InitgPty: {
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
                Cd: string;
              }
            }
          }
        }
      }
    },
    PmtInf: {
      PmtInfId: string;
      PmtMtd: PaymentMethod;
      PmtTpInf: {
        SvcLvl: {
          Cd: string;
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
                Cd: string;
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
          BIC: string;
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
            Cd: string;
          }
        },
        Amt: {
          InstdAmt: number;
        },
        ChrgBr: ServiceLevel;
        CdtrAgt: {
          FinInstnId: {
            BIC: string;
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
                  Cd: string;
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
  }
}
