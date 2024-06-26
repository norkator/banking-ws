'use strict';

import {
  AxiosAgentInterface,
  CertificateInterface,
  CreateCertificateInterface,
  CreatedCertificateInterface, DFFileDescriptor, DFInterface,
  GetCertificateInterface,
  XLFileDescriptor,
  XLInterface, XLPaymentInfoValidationInterface,
  XLPaymentInfoValidationResultInterface,
  XPFileDescriptor,
  XPInterface,
  XTFileDescriptor,
  XTInterface
} from './interfaces';
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
import {Base64DecodeStr, Base64EncodeStr, LoadFileAsString} from './utils/utils';
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
import {XLValidation} from './sepa_payment/XLValidation';
import {XPDFLApplicationRequest} from './download_file_list/XPDFLApplicationRequest';
import {XPDFLRequestEnvelope} from './download_file_list/XPDFLRequestEnvelope';
import {XPDFLApplicationResponse} from './download_file_list/XPDFLApplicationResponse';
import {DFApplicationRequest} from './download_file/DFApplicationRequest';
import {DFRequestEnvelope} from './download_file/DFRequestEnvelope';
import {DFApplicationResponse} from './download_file/DFApplicationResponse';
import * as https from 'https';
import axios from 'axios';
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
import * as path from 'path';


/**
 * Create your own client side certificate
 * @constructor
 * @param cc
 */
async function CreateOwnCertificate(cc: CreateCertificateInterface): Promise<CreatedCertificateInterface> {
  const ownCertificate = new CreateCertificate(cc);

  return await ownCertificate.createCertificate();
}


/**
 * Check just created certificate function meant for test cases and external testing
 * @constructor
 */
async function CheckOwnCertificate(cc: CreateCertificateInterface): Promise<string | null> {
  const ownCertificate = new CreateCertificate(cc);

  return await ownCertificate.checkCertificate();
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
  const options: AxiosAgentInterface = {
    rejectUnauthorized: gc.userParams.rejectUnauthorized
  }
  if (gc.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(gc.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
  const response = await axios.post(gc.requestUrl, certRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  // const response = {
  //   data: LoadFileAsString(path.join(__dirname + '/' + 'test.xml'))
  // };
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
  const certRenewRequestEnvelope = new CertRenewRequestEnvelope(gc.userParams.customerId, gc.RequestId, applicationRequest);
  const options: AxiosAgentInterface = {
    rejectUnauthorized: gc.userParams.rejectUnauthorized
  }
  if (gc.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(gc.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
  const response = await axios.post(gc.requestUrl, certRenewRequestEnvelope.createXmlBody(), {
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
async function BankStatement(xt: XTInterface): Promise<XTFileDescriptor | null> {
  const xtRequest = new XTApplicationRequest(xt);
  const body = await xtRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XTApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const xtRequestEnvelope = new XTRequestEnvelope(xt, applicationRequest);
  const options: AxiosAgentInterface = {
    rejectUnauthorized: xt.userParams.rejectUnauthorized
  }
  if (xt.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(xt.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
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
 * Validate payment infos before providing them to SEPAPayment
 * @constructor
 */
async function SEPAPaymentInfoValidation(xlPmtInfo: XLPaymentInfoValidationInterface): Promise<XLPaymentInfoValidationResultInterface> {
  const xlValidation = new XLValidation(xlPmtInfo);

  return await xlValidation.validatePmtInfos();
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
  const options: AxiosAgentInterface = {
    rejectUnauthorized: xl.userParams.rejectUnauthorized
  }
  if (xl.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(xl.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
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
 * Return list of XP sepa descriptors with DownloadFileList command
 * @constructor
 */
async function DownloadFileList(xp: XPInterface): Promise<XPFileDescriptor[]> {
  const xpRequest = new XPDFLApplicationRequest(xp);
  const body = await xpRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('XPApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const xpRequestEnvelope = new XPDFLRequestEnvelope(xp, applicationRequest);
  const options: AxiosAgentInterface = {
    rejectUnauthorized: xp.userParams.rejectUnauthorized
  }
  if (xp.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(xp.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
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
  const xpResponse = new XPDFLApplicationResponse(xp, response.data);

  return await xpResponse.parseBody();
}


/**
 * Return file descriptors for requested file references using DownloadFile command
 * @constructor
 */
async function DownloadFile(df: DFInterface): Promise<DFFileDescriptor> {
  const dfRequest = new DFApplicationRequest(df);
  const body = await dfRequest.createXmlBody();
  if (body === undefined) {
    throw new Error('DFApplicationRequest returned empty body from createXmlBody');
  }
  const applicationRequest = Base64EncodeStr(body);
  const dfRequestEnvelope = new DFRequestEnvelope(df, applicationRequest);
  const options: AxiosAgentInterface = {
    rejectUnauthorized: df.userParams.rejectUnauthorized
  }
  if (df.userParams.Base64EncodedRootCA !== null) {
    options['ca'] = Base64DecodeStr(df.userParams.Base64EncodedRootCA || '');
  }
  const agent = new https.Agent(options);
  const response = await axios.post(df.requestUrl, await dfRequestEnvelope.createXmlBody(), {
    headers: {
      'Content-Type': 'text/xml',
      SOAPAction: '',
    },
    httpsAgent: agent,
  });
  const dfResponse = new DFApplicationResponse(df, response.data);

  return await dfResponse.parseBody();
}


export {
  CreateOwnCertificate,
  CheckOwnCertificate,
  GetCertificate,
  RenewCertificate,
  BankStatement,
  SEPAPaymentInfoValidation,
  SEPAPayment,
  DownloadFileList,
  DownloadFile,
}
