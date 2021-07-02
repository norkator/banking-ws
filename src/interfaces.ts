import {Bank, Currency, Environment, PaymentMethod, ServiceLevel, Command, Service} from './constants';


/**
 * User environment params like secrets
 */
export interface UserParamsInterface {
  bank: Bank;
  environment: Environment;
  signingPrivateKey: string;
  signingCertificate: string;
  customerId: string;
}

/**
 * User software version params
 */
export interface SoftwareIdInterface {
  name: string;
  version: string;
}

/**
 * Certificate request interface
 */
export interface CertApplicationRequestInterface {
  requestUrl: string;
  CurrentWorkingDirectory?: string;
  SigningPrivateKey?: string;
  CustomerId: string;
  Timestamp: string; // not in use with samlink but mandatory to be in schema
  Environment: Environment;
  SoftwareId: SoftwareIdInterface; // eases problem solving so good to specify
  Command: Command;
  Service: Service;
  ExecutionSerial?: string; // not in use with samlink
  Content: string;
  TransferKey?: string; // used in the first time request
}

/**
 * Definitions for XL SEPA message
 */
export interface XLInterface {
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
