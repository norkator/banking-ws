'use strict';

import * as path from 'path';

const soap = require('strong-soap').soap;
import {ApplicationRequest} from './contents/applicationRequest';
import {XL} from './contents/XL';
import {Bank, Currency, Environment, FileTypes, Operations} from './constants';
import {UserParamsInterface, SoftwareIdInterface, XLInterface} from './interfaces';
import {GetWSDL} from './utils';


async function UploadFile(userParams: UserParamsInterface, uploadFileParams: any) {
  // const WSDL = soap.WSDL;
  // const options = {};
  // WSDL.open(GetWSDL(userParams.environment, userParams.bank), options,
  //   function (err: any, wsdl: any) {
  //     const downloadFileOp = wsdl.definitions.bindings.CorporateFileServiceHttpBinding.operations.downloadFile;
  //     console.log(downloadFileOp.$name)
  //   });

  // const applicationRequest = new ApplicationRequest(
  //   '123456', Operations.downloadFile, '', '', 'NEW',
  //   ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
  //   {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
  // );
  // console.log(applicationRequest.createXmlBody());

  const xlValues: XLInterface = {
    CcyOfTrf: 'EUR',
    GrpHdr: {
      MsgId: 'MSGID000001',
      CreDtTm: '2010-11-14T10:30:00',
      NbOfTxs: 1,
      InitgPty: {
        Nm: 'Group Finance',
        PstlAdr: {
          Ctry: 'FI',
          AdrLine: 'Aleksanterinkatu 123',
          AdrLine2: 'FI-00100 Helsinki',
        },
        Id: {
          OrgId: {
            Othr: {
              Id: '1234567890',
              SchmeNm: {
                Cd: 'BANK',
              }
            }
          }
        }
      }
    },
    PmtInf: {
      PmtInfId: '20101114-12345678912',
      PmtMtd: 'TRF',
      PmtTpInf: {
        SvcLvl: {
          Cd: 'SEPA',
        }
      },
      ReqdExctnDt: '2010-11-14',
      Dbtr: {
        Nm: 'Debtor Company Plc',
        PstlAdr: {
          Ctry: 'FI',
          AdrLine: 'Mannerheimintie 123',
          AdrLine2: 'FI-00100 Helsinki',
        },
        Id: {
          OrgId: {
            Othr: {
              Id: '0987654321',
              SchmeNm: {
                Cd: 'BANK',
              }
            }
          }
        }
      },
      DbtrAcct: {
        Id: {
          IBAN: 'FI8529501800020574',
        }
      },
      DbtrAgt: {
        FinInstnId: {
          BIC: 'BANKFIHH',
        }
      },
      ChrgBr: 'SLEV',
      CdtTrfTxInf: {
        PmtId: {
          InstrId: 'InstrId000001',
          EndToEndId: 'EndToEndId000001',
        },
        PmtTpInf: {
          SvcLvl: {
            Cd: 'SEPA',
          }
        },
        Amt: {
          InstdAmt: 100.00,
        },
        ChrgBr: 'SLEV',
        CdtrAgt:
          {
            FinInstnId: {
              BIC: 'DEUTATWW',
            }
          },
        Cdtr: {
          Nm: 'Creditor Company',
          PstlAdr:
            {
              Ctry: 'AT',
              AdrLine: 'Hohenstaufengasse 123',
              AdrLine2: 'AT-1010 Wien',
            },
          Id: {
            OrgId: {
              Othr: {
                Id: '0987654321',
                SchmeNm: {
                  Cd: 'BANK',
                }
              }
            }
          }
        },
        CdtrAcct: {
          Id: {
            IBAN: 'AT123456789012345678',
          }
        },
        RmtInf: {
          Ustrd: 'Invoices 123 and 321',
        }
      }
    }
  };

  const xl = new XL(xlValues);
  console.log(xl.createXmlBody())

}

// @ts-ignore
UploadFile({environment: 'TEST', bank: 'Samlink'}).then(() => null);

async function DownloadFileList(userParams: UserParamsInterface, downloadFileListParams: any) {

}

async function DownloadFile(userParams: UserParamsInterface, downloadFileParams: any) {

}

async function DeleteFile(userParams: UserParamsInterface, deleteFileParams: any) {

}


export {
  UploadFile,
  DownloadFileList,
  DownloadFile,
  DeleteFile,
}
