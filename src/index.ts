'use strict';

import {
  CertificateInterface,
  GetCertificateInterface, XTInterface
} from './interfaces';
import {Base64EncodeStr, LoadFileAsString} from './utils';
import {CertApplicationRequest} from './get_certificate/certApplicationRequest';
import {CertRequestEnvelope} from './get_certificate/certRequestEnvelope';
import {CertApplicationResponse} from './get_certificate/certApplicationResponse';
import * as https from 'https';
import axios from 'axios';
import {CertRenewRequestEnvelope} from './get_certificate/certRenewRequestEnvelope';
import {XTApplicationRequest} from './bank_statement/XTApplicationRequest';


/**
 *
 * @param gc
 * @constructor
 */
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


/**
 *
 * @param gc
 * @constructor
 */
async function RenewCertificate(gc: GetCertificateInterface): Promise<CertificateInterface> {
  const certRequest = new CertApplicationRequest(gc);
  const body = await certRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('CertApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const certRenewRequestEnvelope = new CertRenewRequestEnvelope(gc, applicationRequest);
  const agent = new https.Agent({
    ca: await LoadFileAsString(gc.userParams.rootCAPath)
  });
  const response = await axios.post(gc.requestUrl, await certRenewRequestEnvelope.createXmlBody(), {
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

/**
 *
 * @constructor
 */
async function SEPAPayment() {
  // const xl = new XL(xlParams);
  // const xlMessage = xl.createXmlBody();
  // const applicationRequest = new ApplicationRequest(
  //   '123456', Operations.downloadFile, '', '', 'NEW',
  //   ['test1', 'test2', 'test3'], 'TestFileName', false, 0, 0,
  //   {name: 'Test', version: '0.9.0'} as SoftwareIdInterface, FileTypes.XT
  // );
  // console.log(applicationRequest.createXmlBody());
}


/**
 *
 * @param xt
 * @constructor
 */
async function BankStatement(xt: XTInterface): Promise<string> {
  const xtRequest = new XTApplicationRequest(xt);
  const body = await xtRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XTApplicationRequest returned empty body from createXmlBody');
  }
  console.log(body);
  process.exit(0);
  // const applicationRequest = Base64EncodeStr(body);
  // const xtRequestEnvelope = new XTRequestEnvelope(xt, applicationRequest);
  // const agent = new https.Agent({
  //   ca: await LoadFileAsString(xt.userParams.rootCAPath)
  // });
  // const response = await axios.post(xr.requestUrl, await xtRequestEnvelope.createXmlBody(), {
  //   headers: {
  //     'Content-Type': 'text/xml',
  //     SOAPAction: '',
  //   },
  //   httpsAgent: agent,
  // });
  // return response.data;
  return '';
}


export {
  GetCertificate,
  RenewCertificate,
  SEPAPayment,
  BankStatement,
}
