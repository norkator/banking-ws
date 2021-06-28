import {Bank, Environment} from './constants';

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
  GrpHdr: { // Group Header
    MsgId: string; // Message Identification
    CreDtTm: string; // Creation Date Time
    Authstn: string;
    BtchBookg: boolean;
    NbOfTxs: string; // Number Of Transactions
    CtrlSum: number; // Control Sum
    Grpg: string;
    InitgPty: { // Initiating Party
      Nm: string;
      PstlAdr: {
        AdrTp: string;
        AdrLine: string;
        StrtNm: string;
        BldgNb: string;
        PstCd: string;
        TwnNm: string;
        CtrySubDvsn: string;
        Ctry: string;
      };
      Id: {
        OrgId: {
          BIC: string;
          IBEI: string;
          BEI: string;
          EANGLN: string;
          USCHU: string;
          DUNS: string;
          BkPtyId: string;
          TaxIdNb: string;
          PrtryId: {
            Id: string;
            Issr: string;
          }
        }
      }
      CtryOfRes: string;
    };
    FwdgAgt: {
      FinInstnId: {
        BIC: string;
      };
      BrnchId: {
        Id: string;
        Nm: string;
        PstlAdr: {
          AdrTp: string;
          AdrLine: string;
          StrtNm: string;
          BldgNb: string;
          PstCd: string;
          TwnNm: string;
          CtrySubDvsn: string;
          Ctry: string;
        }
      }
    }
  };
  PmtInf: {}
}
