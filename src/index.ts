'use strict';

import * as path from 'path';

const soap = require('strong-soap').soap;
import {ApplicationRequest} from './contents/applicationRequest';
import {XL} from './contents/XL';
import {Bank, Currency, Environment, FileTypes, Operations} from './constants';
import {UserParamsInterface, SoftwareIdInterface, XLInterface, CertApplicationRequestInterface} from './interfaces';
import {GetWSDL} from './utils';
import {CertApplicationRequest} from "./contents/certApplicationRequest";


async function GetCertificate(firstTimeRequest: boolean, crp: CertApplicationRequestInterface): Promise<string> {
  const certRequest = new CertApplicationRequest(firstTimeRequest, crp);
  console.log(await certRequest.createXmlBody());
  return '';
}

async function UploadFile(userParams: UserParamsInterface, xlParams: XLInterface) {
  const xl = new XL(xlParams);
  const xlMessage = xl.createXmlBody();

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
}

async function DownloadFileList(userParams: UserParamsInterface, downloadFileListParams: any) {
}

async function DownloadFile(userParams: UserParamsInterface, downloadFileParams: any) {
}

async function DeleteFile(userParams: UserParamsInterface, deleteFileParams: any) {
}


export {
  GetCertificate,
  UploadFile,
  DownloadFileList,
  DownloadFile,
  DeleteFile,
}
