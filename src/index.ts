import {ApplicationRequest} from './applicationRequest';
import {FileTypes, Operations} from './constants';
import {SoftwareIdInterface} from "./interfaces";


const applicationRequest = new ApplicationRequest(
  '123456', Operations.downloadFile, '', '', 'NEW',
  ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
  {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
);
console.log(applicationRequest.createXmlBody());


async function UploadFile() {

}

async function DownloadFileList() {

}

async function DownloadFile() {

}

async function DeleteFile() {

}


export {
  UploadFile,
  DownloadFileList,
  DownloadFile,
  DeleteFile,
}
