'use strict';

import {
  CertificateInterface, CreateCertificateInterface, CreatedCertificateInterface,
  GetCertificateInterface, XLFileDescriptor, XLInterface, XPFileDescriptor, XPInterface, XTInterface
} from './interfaces';
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
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
import {XPApplicationResponse} from './sepa_error/XPApplicationResponse';
import {XTRequestEnvelope} from './bank_statement/XTRequestEnvelope';
import {XLRequestEnvelope} from './sepa_payment/XLRequestEnvelope';
import {XPApplicationRequest} from './sepa_error/XPApplicationRequest';
import {XPRequestEnvelope} from './sepa_error/XPRequestEnvelope';
import * as https from 'https';
import axios from 'axios';
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
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
  if (gc.mockResponse) {
    const car = new CertApplicationResponse(gc, undefined);
    return car.mockResponse();
  }
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
  return await car.parseBody();
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
  if (gc.mockResponse) {
    const car = new CertApplicationResponse(gc, undefined);
    return car.mockResponse();
  }
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
  return await car.parseBody();
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
  if (xt.mockResponse) {
    return 'mock response not defined for xt message'
  }
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
async function SEPAPayment(xl: XLInterface): Promise<XLFileDescriptor> {
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
  if (xl.mockResponse) {
    const xlResponse = new XLApplicationResponse(xl, undefined);
    return xlResponse.mockResponse();
  }
  const response = await axios.post(xl.requestUrl, await xlRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'sepa_response_test.xml'))
  // };
  const xlResponse = new XLApplicationResponse(xl, response.data);
  return await xlResponse.parseBody();
}


/**
 * Return SEPA errors with DownloadFileList command
 * @constructor
 */
async function SEPAErrors(xp: XPInterface): Promise<XPFileDescriptor[]> {
  const xpRequest = new XPApplicationRequest(xp);
  const body = await xpRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XPApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const xpRequestEnvelope = new XPRequestEnvelope(xp, applicationRequest);
  const agent = new https.Agent({
    ca: Base64DecodeStr(xp.userParams.Base64EncodedRootCA)
  });
  if (xp.mockResponse) {
    const xpResponse = new XPApplicationResponse(xp, undefined);
    return xpResponse.mockResponse();
  }
  const response = await axios.post(xp.requestUrl, await xpRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/../' + 'xp_response.xml'))
  // };
  const xpResponse = new XPApplicationResponse(xp, response.data);
  return await xpResponse.parseBody();
}


export {
  CreateOwnCertificate,
  GetCertificate,
  RenewCertificate,
  BankStatement,
  SEPAPayment,
  SEPAErrors,
}
