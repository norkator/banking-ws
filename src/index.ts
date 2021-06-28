'use strict';

import * as path from 'path';

const soap = require('strong-soap').soap;
import {ApplicationRequest} from './contents/applicationRequest';
import {XL} from './contents/XL';
import {Bank, Environment, FileTypes, Operations} from './constants';
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
    GrpHdr: {
      MsgId: 'test',
      CreDtTm: 'test',
      Authstn: 'test',
      BtchBookg: true,
      NbOfTxs: 'test',
      CtrlSum: 123,
      Grpg: 'test',
      InitgPty: {
        Nm: 'test',
        PstlAdr: {
          AdrTp: 'test',
          AdrLine: 'test',
          StrtNm: 'test',
          BldgNb: 'test',
          PstCd: 'test',
          TwnNm: 'test',
          CtrySubDvsn: 'test',
          Ctry: 'test',
        },
        Id: {
          OrgId: {
            BIC: 'test',
            IBEI: 'test',
            BEI: 'test',
            EANGLN: 'test',
            USCHU: 'test',
            DUNS: 'test',
            BkPtyId: 'test',
            TaxIdNb: 'test',
            PrtryId: {
              Id: 'test',
              Issr: 'test',
            }
          }
        },
        CtryOfRes: 'test',
      },
      FwdgAgt: {
        FinInstnId: {
          BIC: 'test',
        },
        BrnchId: {
          Id: 'test',
          Nm: 'test',
          PstlAdr: {
            AdrTp: 'test',
            AdrLine: 'test',
            StrtNm: 'test',
            BldgNb: 'test',
            PstCd: 'test',
            TwnNm: 'test',
            CtrySubDvsn: 'test',
            Ctry: 'test',
          }
        }
      }
    },
    PmtInf: {}
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
