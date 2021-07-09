'use strict';

import {XL} from './contents/XL';
import {UserParamsInterface, XLInterface, CertApplicationRequestInterface, CertificateInterface} from './interfaces';
import {Base64EncodeStr, LoadFileAsString} from './utils';
import {CertApplicationRequest} from './contents/certApplicationRequest';
import {CertRequestEnvelope} from './contents/CertRequestEnvelope';
import {CertApplicationResponse} from './contents/certApplicationResponse';
import * as https from 'https';
import axios from 'axios';
import * as path from "path";


async function GetCertificate(
  userParams: UserParamsInterface, firstTimeRequest: boolean, crp: CertApplicationRequestInterface, requestId: string,
): Promise<CertificateInterface> {
  const certRequest = new CertApplicationRequest(firstTimeRequest, crp);
  const body = await certRequest.createXmlBody();

  if (body === undefined) {
    throw new Error('CertApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const certRequestEnvelope = new CertRequestEnvelope(crp.CustomerId, requestId, applicationRequest);


  const agent = new https.Agent({
    ca: userParams.rootCA
  });

  // return;
  const response = await axios.post(crp.requestUrl, certRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'certtestresponse.xml'))
  // };

  console.log(response.data);

  const car = new CertApplicationResponse(firstTimeRequest, response.data, userParams.customerId);
  await car.parseBody();

  if (car.isValid()) {
    return car.getCertificate()
  } else {
    throw new Error('Response is not valid!')
  }
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
