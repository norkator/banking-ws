'use strict';

import {
  CertificateInterface, CreateCertificateInterface, CreatedCertificateInterface,
  GetCertificateInterface, XLInterface, XTInterface
} from './interfaces';
import {Base64DecodeStr, Base64EncodeStr, LoadFileAsString} from './utils';
import {CreateCertificate} from './create_certificate/CreateCertificate';
import {XLApplicationRequest} from './sepa_payment/XLApplicationRequest';
import {CertApplicationRequest} from './get_certificate/certApplicationRequest';
import {CertRequestEnvelope} from './get_certificate/certRequestEnvelope';
import {CertApplicationResponse} from './get_certificate/certApplicationResponse';
import {XTApplicationResponse} from './bank_statement/XTApplicationResponse';
import {CertRenewRequestEnvelope} from './get_certificate/certRenewRequestEnvelope';
import {XTApplicationRequest} from './bank_statement/XTApplicationRequest';
import {XLApplicationResponse} from './sepa_payment/XLApplicationResponse';
import {XTRequestEnvelope} from './bank_statement/XTRequestEnvelope';
import {XLRequestEnvelope} from './sepa_payment/XLRequestEnvelope';
import * as https from 'https';
import axios from 'axios';
import * as path from 'path';


/**
 * Create your own client side certificate
 * @param cc, certificate parameters
 * @constructor
 */
async function CreateOwnCertificate(cc: CreateCertificateInterface): Promise<CreatedCertificateInterface> {
  const ownCertificate = new CreateCertificate(cc);
  return await ownCertificate.createCertificate();
}


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
    ca: Base64DecodeStr(gc.userParams.Base64EncodedRootCA)
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
    ca: Base64DecodeStr(gc.userParams.Base64EncodedRootCA)
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
    ca: Base64DecodeStr(xt.userParams.Base64EncodedRootCA)
  });
  const response = await axios.post(xt.requestUrl, await xtRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'test_response_original.xml'))
  // };
  const xtResponse = new XTApplicationResponse(xt, response.data);
  return await xtResponse.parseBody();
}


/**
 * Initiate outgoing SEPA payment with using pain.001.001.02 standard
 * @constructor
 */
async function SEPAPayment(xl: XLInterface): Promise<string> {
  const xlRequest = new XLApplicationRequest(xl);
  const body = await xlRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XLApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const xlRequestEnvelope = new XLRequestEnvelope(xl, applicationRequest);
  const agent = new https.Agent({
    ca: Base64DecodeStr(xl.userParams.Base64EncodedRootCA)
  });
  // const response = await axios.post(xl.requestUrl, await xlRequestEnvelope.createXmlBody(), {
  //   headers: {
  //     'Content-Type': 'text/xml',
  //     SOAPAction: '',
  //   },
  //   httpsAgent: agent,
  // });
  const response = {
    data: LoadFileAsString(path.join(__dirname + '/../' + 'sepa_response_test.xml'))
  };
  const xlResponse = new XLApplicationResponse(xl, response.data);
  return await xlResponse.parseBody();
}


export {
  CreateOwnCertificate,
  GetCertificate,
  RenewCertificate,
  BankStatement,
  SEPAPayment,
}
