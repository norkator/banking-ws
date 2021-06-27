'use strict';

import * as path from 'path';

const soap = require('strong-soap').soap;
import {ApplicationRequest} from './applicationRequest';
import {Bank, Environment, FileTypes, Operations} from './constants';
import {UserParamsInterface, SoftwareIdInterface} from './interfaces';

// const applicationRequest = new ApplicationRequest(
//   '123456', Operations.downloadFile, '', '', 'NEW',
//   ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
//   {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
// );
// console.log(applicationRequest.createXmlBody());


async function UploadFile(userParams: UserParamsInterface, uploadFileParams: any) {
  const WSDL = soap.WSDL;
  const options = {};
  WSDL.open(GetWSDL(userParams.environment, userParams.bank), options,
    function (err, wsdl) {
      const downloadFileOp = wsdl.definitions.bindings.CorporateFileServiceHttpBinding.operations.downloadFile;
      console.log(downloadFileOp.$name)
    });
}

// @ts-ignore
UploadFile({environment: 'TEST', bank: 'samlink'}).then(() => null);

async function DownloadFileList(userParams: UserParamsInterface, downloadFileListParams: any) {

}

async function DownloadFile(userParams: UserParamsInterface, downloadFileParams: any) {

}

async function DeleteFile(userParams: UserParamsInterface, deleteFileParams: any) {

}


/**
 * Get WSDL based on environment
 * @return {string} wsdl file path and name
 */
function GetWSDL(environmnet: Environment, bank: Bank) {
  return path.join(__dirname + '/wsdl/wsdl_' + bank + '_' + environmnet.toLowerCase() + '.xml');
}


export {
  UploadFile,
  DownloadFileList,
  DownloadFile,
  DeleteFile,
}
