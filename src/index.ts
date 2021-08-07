'use strict';

import {
  CertificateInterface,
  GetCertificateInterface, XTInterface
} from './interfaces';
import {Base64EncodeStr, LoadFileAsString} from './utils';
import {CertApplicationRequest} from './get_certificate/certApplicationRequest';
import {CertRequestEnvelope} from './get_certificate/certRequestEnvelope';
import {CertApplicationResponse} from './get_certificate/certApplicationResponse';
import {XTApplicationResponse} from './bank_statement/XTApplicationResponse';
import {CertRenewRequestEnvelope} from './get_certificate/certRenewRequestEnvelope';
import {XTApplicationRequest} from './bank_statement/XTApplicationRequest';
import {XTRequestEnvelope} from './bank_statement/XTRequestEnvelope';
import * as https from 'https';
import * as path from 'path';
import axios from 'axios';


/**
 * Initial certificate get function to get certificate with one time use transfer key
 * @param gc interface describes mandatory parameters
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
 * Renew certificate using old certificate before it expires
 * @param gc interface describes mandatory parameters
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
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'test.xml'))
  // };
  const car = new CertApplicationResponse(gc, response.data);
  await car.parseBody();
  if (car.isValid()) {
    return car.getCertificate()
  } else {
    throw new Error('Response is not valid!')
  }
}


/**
 * Initiate outgoing SEPA payment with using pain.001.001.02 standard
 * @constructor
 */
async function SEPAPayment() {
  // Todo...
}


/**
 * Bank statement returns account info with camt.053.001.02 standard
 * @param xt interface describes mandatory parameters
 * @constructor
 */
async function BankStatement(xt: XTInterface): Promise<string> {
  const xtRequest = new XTApplicationRequest(xt);
  const body = await xtRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XTApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const xtRequestEnvelope = new XTRequestEnvelope(xt, applicationRequest);
  const agent = new https.Agent({
    ca: await LoadFileAsString(xt.userParams.rootCAPath)
  });
  const response = await axios.post(xt.requestUrl, await xtRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // Todo, create response parser here, maybe try to transform it to json?
  const xtResponse = new XTApplicationResponse(xt, response.data);
  return await xtResponse.parseBody();
}


export {
  GetCertificate,
  RenewCertificate,
  SEPAPayment,
  BankStatement,
}
