'use strict';

import {XL} from './sepa_payment/XL';
import {
  UserParamsInterface,
  XLInterface,
  CertificateInterface,
  GetCertificateInterface
} from './interfaces';
import {Base64EncodeStr, LoadFileAsString} from './utils';
import {CertApplicationRequest} from './get_certificate/certApplicationRequest';
import {CertRequestEnvelope} from './get_certificate/certRequestEnvelope';
import {CertApplicationResponse} from './get_certificate/certApplicationResponse';
import * as https from 'https';
import axios from 'axios';
import * as path from 'path';
import {CertRenewRequestEnvelope} from "./get_certificate/certRenewRequestEnvelope";


async function GetCertificate(gc: GetCertificateInterface): Promise<CertificateInterface> {
  const certRequest = new CertApplicationRequest(gc);
  const body = await certRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('CertApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const certRequestEnvelope = new CertRequestEnvelope(gc.userParams.customerId, gc.RequestId, applicationRequest);
  const agent = new https.Agent({
    ca: await LoadFileAsString(gc.userParams.rootCAPath)
  });
  const response = await axios.post(gc.requestUrl, certRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'test.xml'))
  // };
  // console.log(response.data);
  const car = new CertApplicationResponse(gc, response.data);
  await car.parseBody();
  if (car.isValid()) {
    return car.getCertificate()
  } else {
    throw new Error('Response is not valid!')
  }
}


async function RenewCertificate(gc: GetCertificateInterface): Promise<CertificateInterface> {
  const certRequest = new CertApplicationRequest(gc);
  const body = await certRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('CertApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const certRenewRequestEnvelope = new CertRenewRequestEnvelope(gc.userParams.customerId, gc.RequestId, applicationRequest);
  const agent = new https.Agent({
    ca: await LoadFileAsString(gc.userParams.rootCAPath)
  });
  const response = await axios.post(gc.requestUrl, certRenewRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  const car = new CertApplicationResponse(gc, response.data);
  await car.parseBody();
  if (car.isValid()) {
    return car.getCertificate()
  } else {
    throw new Error('Response is not valid!')
  }
}

async function SEPAPayment(userParams: UserParamsInterface, xlParams: XLInterface) {
  const xl = new XL(xlParams);
  const xlMessage = xl.createXmlBody();
  // const applicationRequest = new ApplicationRequest(
  //   '123456', Operations.downloadFile, '', '', 'NEW',
  //   ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
  //   {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
  // );
  // console.log(applicationRequest.createXmlBody());
}

async function BankStatement(userParams: UserParamsInterface, downloadFileListParams: any) {
}


export {
  GetCertificate,
  RenewCertificate,
  SEPAPayment,
  BankStatement,
}
