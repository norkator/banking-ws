'use strict';

import {XL} from './contents/XL';
import {UserParamsInterface, XLInterface, CertApplicationRequestInterface} from './interfaces';
import {Base64EncodeStr} from './utils';
import {CertApplicationRequest} from './contents/certApplicationRequest';
import {CertRequestEnvelope} from './contents/CertRequestEnvelope';
import {CertApplicationResponse} from './contents/certApplicationResponse';
import axios from 'axios';


async function GetCertificate(
  userParams: UserParamsInterface, firstTimeRequest: boolean, crp: CertApplicationRequestInterface, requestId: string,
): Promise<CertApplicationResponse> {
  const certRequest = new CertApplicationRequest(firstTimeRequest, crp);
  const body = await certRequest.createXmlBody();

  if (body === undefined) {
    throw new Error('CertApplicationRequest returned emtpy body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const certRequestEnvelope = new CertRequestEnvelope(crp.CustomerId, requestId, applicationRequest);

  const response = await axios.post(crp.requestUrl, certRequestEnvelope, {
    headers: {'Content-Type': 'text/xml'}
  });

  return new CertApplicationResponse(response.data);
}


async function UploadFile(userParams: UserParamsInterface, xlParams: XLInterface) {
  const xl = new XL(xlParams);
  const xlMessage = xl.createXmlBody();
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
