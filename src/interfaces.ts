import {Bank, Currency, Environment, PaymentMethod, ServiceLevel} from './constants';

export interface UserParamsInterface {
  bank: Bank;
  environment: Environment;
  signingPrivate_key: string;
  signingCertificate: string;
  customerId: string;
}

export interface SoftwareIdInterface {
  name: string;
  version: string;
}


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
