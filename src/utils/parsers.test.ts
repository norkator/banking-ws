// import * as mocha from 'mocha';
import * as chai from 'chai';
import {Base64DecodeStr } from './utils';
import { ParseContentFromPaymentStatusReport, ParsePaymentStatusReport } from './parsers';

const expect = chai.expect;
describe('Parsers', async () => {

  // these are generated for tests use only (dummy ones)
  const PAYMENT_STATUS_RECEIVED_XML_ENCODED = 'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz48RG9jdW1lbnQgeG1sbnM9InVybjppc286c3RkOmlzbzoyMDAyMjp0ZWNoOnhzZDpwYWluLjAwMi4wMDEuMDMiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiPjxDc3RtclBtdFN0c1JwdD48R3JwSGRyPjxNc2dJZD4wMTg3MTQ5MF80NzI0MjA1NzM2OTwvTXNnSWQ+PENyZUR0VG0+MjAyMy0wOS0wNVQxODo1OToxMC4xODMrMDI6MDA8L0NyZUR0VG0+PEluaXRnUHR5PjxObT5Fc2ltZXJra2kgT3k8L05tPjwvSW5pdGdQdHk+PERidHJBZ3Q+PEZpbkluc3RuSWQ+PEJJQz5PS09ZRklISDwvQklDPjwvRmluSW5zdG5JZD48L0RidHJBZ3Q+PC9HcnBIZHI+PE9yZ25sR3JwSW5mQW5kU3RzPjxPcmdubE1zZ0lkPk1TR0lEMjAyMzA0PC9PcmdubE1zZ0lkPjxPcmdubE1zZ05tSWQ+cGFpbi4wMDEuMDAxLjAyPC9PcmdubE1zZ05tSWQ+PEdycFN0cz5BQ1RDPC9HcnBTdHM+PC9PcmdubEdycEluZkFuZFN0cz48L0NzdG1yUG10U3RzUnB0PjwvRG9jdW1lbnQ+';
  const PAYMENT_STATUS_AS_OBJECT = '{"GrpHdr":{"MsgId":"01871490_47242057369","CreDtTm":"2023-09-05T18:59:10.183+02:00","InitgPty":{"Nm":"Esimerkki Oy"},"DbtrAgt":{"FinInstnId":{"BIC":"OKOYFIHH"}}},"OrgnlGrpInfAndSts":{"OrgnlMsgId":"MSGID202304","OrgnlMsgNmId":"pain.001.001.02","GrpSts":"ACTC"}}';
  // eslint-disable-next-line quotes
  const PAYMENT_STATUS_RECEIVED_XML = `<?xml version='1.0' encoding='UTF-8'?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.002.001.03" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><CstmrPmtStsRpt><GrpHdr><MsgId>01871490_47242057369</MsgId><CreDtTm>2023-09-05T18:59:10.183+02:00</CreDtTm><InitgPty><Nm>Esimerkki Oy</Nm></InitgPty><DbtrAgt><FinInstnId><BIC>OKOYFIHH</BIC></FinInstnId></DbtrAgt></GrpHdr><OrgnlGrpInfAndSts><OrgnlMsgId>MSGID202304</OrgnlMsgId><OrgnlMsgNmId>pain.001.001.02</OrgnlMsgNmId><GrpSts>ACTC</GrpSts></OrgnlGrpInfAndSts></CstmrPmtStsRpt></Document>`;
  const PAYMENT_STATUS_REPORT_STRUCTURE_APPROVED = 'PD94bWwgdmVyc2lvbj0xLjAgZW5jb2Rpbmc9VVRGLTg/PjxEb2N1bWVudCB4bWxucz0idXJuOmlzbzpzdGQ6aXNvOjIwMDIyOnRlY2g6eHNkOnBhaW4uMDAyLjAwMS4wMyIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSI+PENzdG1yUG10U3RzUnB0PjxHcnBIZHI+PE1zZ0lkPlNUQVQyMDA5MDEyODE2MzMxMzEwPC9Nc2dJZD48Q3JlRHRUbT4yMDA5LTAxLTI4VDE2OjMzOjEzPC9DcmVEdFRtPjwvR3JwSGRyPjxPcmdubEdycEluZkFuZFN0cz48T3JnbmxNc2dJZD5NU0dJRDAwMDAwOTwvT3JnbmxNc2dJZD48T3JnbmxNc2dObUlkPnBhaW4uMDAxPC9PcmdubE1zZ05tSWQ+PEdycFN0cz5BQ1RDPC9HcnBTdHM+PC9PcmdubEdycEluZkFuZFN0cz48L0NzdG1yUG10U3RzUnB0PjwvRG9jdW1lbnQ+Cg==';
  const PAYMENT_STATUS_REPORT_STRUCTURE_REJECTED = 'PD94bWwgdmVyc2lvbj0xLjAgZW5jb2Rpbmc9VVRGLTg/PjxEb2N1bWVudCB4bWxucz0idXJuOmlzbzpzdGQ6aXNvOjIwMDIyOnRlY2g6eHNkOnBhaW4uMDAyLjAwMS4wMyIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSI+PENzdG1yUG10U3RzUnB0PjxHcnBIZHI+PE1zZ0lkPlNUQVQyMDA5MDEyODE2MzMxMzExPC9Nc2dJZD48Q3JlRHRUbT4yMDA5LTAxLTI4VDE2OjMzOjE0PC9DcmVEdFRtPjwvR3JwSGRyPjxPcmdubEdycEluZkFuZFN0cz48T3JnbmxNc2dJZD5NU0dJRDAwMDAxMDwvT3JnbmxNc2dJZD48T3JnbmxNc2dObUlkPnBhaW4uMDAxPC9PcmdubE1zZ05tSWQ+PEdycFN0cz5SSkNUPC9HcnBTdHM+PC9PcmdubEdycEluZkFuZFN0cz48L0NzdG1yUG10U3RzUnB0PjwvRG9jdW1lbnQ+Cg==';
  const PAYMENT_STATUS_REPORT_CONTENT_APPROVED = 'PD94bWwgdmVyc2lvbj0xLjAgZW5jb2Rpbmc9VVRGLTg/PjxEb2N1bWVudCB4bWxucz0idXJuOmlzbzpzdGQ6aXNvOjIwMDIyOnRlY2g6eHNkOnBhaW4uMDAyLjAwMS4wMyIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSI+PENzdG1yUG10U3RzUnB0PjxHcnBIZHI+PE1zZ0lkPlNUQVQyMDA5MDEyODE2MzMxMzEyPC9Nc2dJZD48Q3JlRHRUbT4yMDA5LTAxLTI4VDE2OjMzOjE1PC9DcmVEdFRtPjwvR3JwSGRyPjxPcmdubEdycEluZkFuZFN0cz48T3JnbmxNc2dJZD5NU0dJRDAwMDAxMTwvT3JnbmxNc2dJZD48T3JnbmxNc2dObUlkPnBhaW4uMDAxPC9PcmdubE1zZ05tSWQ+PEdycFN0cz5BQ0NQPC9HcnBTdHM+PC9PcmdubEdycEluZkFuZFN0cz48L0NzdG1yUG10U3RzUnB0PjwvRG9jdW1lbnQ+IMIK';
  const PAYMENT_STATUS_REPORT_PARTIALLY_ACCEPTED = 'PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0nVVRGLTgnPz48RG9jdW1lbnQgeG1sbnM9InVybjppc286c3RkOmlzbzoyMDAyMjp0ZWNoOnhzZDpwYWluLjAwMi4wMDEuMDMiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiPjxDc3RtclBtdFN0c1JwdD48R3JwSGRyPjxNc2dJZD5TVEFUMjAwOTAxMjgxNjMzMTMxMTwvTXNnSWQ+PENyZUR0VG0+MjAwOS0wMS0yOFQxNjozMzoxNDwvQ3JlRHRUbT48L0dycEhkcj48T3JnbmxHcnBJbmZBbmRTdHM+PE9yZ25sTXNnSWQ+TVNHSUQwMDAwMTA8L09yZ25sTXNnSWQ+PE9yZ25sTXNnTm1JZD5wYWluLjAwMTwvT3JnbmxNc2dObUlkPjxHcnBTdHM+UEFSVDwvR3JwU3RzPjwvT3JnbmxHcnBJbmZBbmRTdHM+PC9Dc3RtclBtdFN0c1JwdD48L0RvY3VtZW50Pg';
  const PAYMENT_STATUS_REPORT_SINGLE_REJECTED = 'PD94bWwgdmVyc2lvbj0xLjAgZW5jb2Rpbmc9VVRGLTg/PjxEb2N1bWVudCB4bWxucz0idXJuOmlzbzpzdGQ6aXNvOjIwMDIyOnRlY2g6eHNkOnBhaW4uMDAyLjAwMS4wMyIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSI+PENzdG1yUG10U3RzUnB0PjxHcnBIZHI+PE1zZ0lkPkNQUzIwMDkwODIxMTEyMDE3NTEyPC9Nc2dJZD48Q3JlRHRUbT4yMDA5LTA4LTIxVDExOjExOjE3LjUxMyswMTowMDwvQ3JlRHRUbT48L0dycEhkcj48T3JnbmxHcnBJbmZBbmRTdHM+PE9yZ25sTXNnSWQ+TVNHSUQwMDAwMTI8L09yZ25sTXNnSWQ+PE9yZ25sTXNnTm1JZD5wYWluLjAwMTwvT3JnbmxNc2dObUlkPjwvT3JnbmxHcnBJbmZBbmRTdHM+PE9yZ25sUG10SW5mQW5kU3RzPjxPcmdubFBtdEluZklkPjIwMTAxMTE0LTIzNDU2Nzg5MDE8L09yZ25sUG10SW5mSWQ+PFR4SW5mQW5kU3RzPjxPcmdubEVuZFRvRW5kSWQ+RW5kVG9FbmRJZDAwMDAwMTwvT3JnbmxFbmRUb0VuZElkPjxUeFN0cz5SSkNUPC9UeFN0cz48U3RzUnNuSW5mPjxSc24+PENkPkFDMDE8L0NkPjwvUnNuPjxBZGR0bEluZj5Gb3JtYXQgb2YgdGhlIGFjY291bnQgbnVtYmVyIHNwZWNpZmllZCBpcyBub3QgY29ycmVjdDwvQWRkdGxJbmY+PC9TdHNSc25JbmY+PC9UeEluZkFuZFN0cz48L09yZ25sUG10SW5mQW5kU3RzPjwvQ3N0bXJQbXRTdHNScHQ+PC9Eb2N1bWVudD4K';

  it('should decode that base64', async () => {
      const c = Base64DecodeStr(PAYMENT_STATUS_RECEIVED_XML_ENCODED);
      expect(c).equal(PAYMENT_STATUS_RECEIVED_XML);
    });

  it('should return status report as a valid object', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_RECEIVED_XML_ENCODED); 
    const expectedResult = JSON.parse(PAYMENT_STATUS_AS_OBJECT);
    expect(c).equal(JSON.stringify(expectedResult));
    });

  it('should return payment status report with approved structure', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_REPORT_STRUCTURE_APPROVED);
    const b = await ParsePaymentStatusReport(JSON.parse(c));
    expect(b.Status.GroupStatus).to.equal('ACTC');
  });

  it('should return payment status report with rejected structure', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_REPORT_STRUCTURE_REJECTED);
    const b = await ParsePaymentStatusReport(JSON.parse(c));
    expect(b.Status.GroupStatus).to.equal('RJCT');
  });

  it('should return payment status report with content approved', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_REPORT_CONTENT_APPROVED);
    const b = await ParsePaymentStatusReport(JSON.parse(c));
    expect(b.Status.GroupStatus).to.equal('ACCP');
  });

  it('should return payment status report partially approved', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_REPORT_PARTIALLY_ACCEPTED);
    const b = await ParsePaymentStatusReport(JSON.parse(c));
    expect(b.Status.GroupStatus).to.equal('PART');
  });

  it('should return payment status report rejected (single transaction)', async () => {
    const c = await ParseContentFromPaymentStatusReport(PAYMENT_STATUS_REPORT_SINGLE_REJECTED);
    const b = await ParsePaymentStatusReport(JSON.parse(c)); 
    expect(b.Status.TransactionStatus).to.equal('RJCT');
  });
});
