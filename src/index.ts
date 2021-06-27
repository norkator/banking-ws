'use strict';

import {ApplicationRequest} from './applicationRequest';
import {FileTypes, Operations} from './constants';
import {UserParamsInterface, SoftwareIdInterface} from './interfaces';

// const applicationRequest = new ApplicationRequest(
//   '123456', Operations.downloadFile, '', '', 'NEW',
//   ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
//   {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
// );
// console.log(applicationRequest.createXmlBody());


async function UploadFile(userParams: UserParamsInterface, uploadFileParams: any) {

}

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
