import * as chai from 'chai';
import {SoftwareIdInterface, UserParamsInterface, XPFileDescriptor, XPInterface} from '../interfaces';
import {XPDFLApplicationResponse} from './XPDFLApplicationResponse';
// @ts-ignore
import moment from 'moment/moment';

const expect = chai.expect;
describe('XPDFLApplicationResponse', async () => {

  it('should return expected list of file descriptors with status new', async () => {
    const dfListApplicationResponseMessage = '<?xml version=\'1.0\' encoding=\'UTF-8\'?><soapenv:Envelope xmlns:cor="http://bxd.fi/CorporateFileService" xmlns:mod="http://model.bxd.fi" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header></soapenv:Header><soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-5e3ba271-1260-40fa-9b8f-880507ffa7ec"><cor:downloadFileListout><mod:ResponseHeader><mod:SenderId>12345678</mod:SenderId><mod:RequestId>123456</mod:RequestId><mod:Timestamp>2023-08-30T17:23:07.157</mod:Timestamp><mod:ResponseCode>00</mod:ResponseCode><mod:ResponseText>OK</mod:ResponseText><mod:ReceiverId></mod:ReceiverId></mod:ResponseHeader><mod:ApplicationResponse>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PEFwcGxpY2F0aW9uUmVzcG9uc2UgeG1sbnM9Imh0dHA6Ly9ieGQuZmkveG1sZGF0YS8iIHhtbG5zOm5zMj0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+PEN1c3RvbWVySWQ+MTIzNDU2Nzg8L0N1c3RvbWVySWQ+PFRpbWVzdGFtcD4yMDIzLTA4LTMwVDE3OjIzOjA3LjE0NSswMzowMDwvVGltZXN0YW1wPjxSZXNwb25zZUNvZGU+MDA8L1Jlc3BvbnNlQ29kZT48UmVzcG9uc2VUZXh0Pk9LPC9SZXNwb25zZVRleHQ+PEV4ZWN1dGlvblNlcmlhbD40MzQzNDU8L0V4ZWN1dGlvblNlcmlhbD48RW5jcnlwdGVkPmZhbHNlPC9FbmNyeXB0ZWQ+PENvbXByZXNzZWQ+ZmFsc2U8L0NvbXByZXNzZWQ+PEZpbGVEZXNjcmlwdG9ycz48RmlsZURlc2NyaXB0b3I+PEZpbGVSZWZlcmVuY2U+MTU4MDQ0MDgzNTwvRmlsZVJlZmVyZW5jZT48VGFyZ2V0SWQ+Tk9ORTwvVGFyZ2V0SWQ+PFVzZXJGaWxlbmFtZT5wYWluMDMgcGFsYXV0ZTwvVXNlckZpbGVuYW1lPjxGaWxlVHlwZT5YUDwvRmlsZVR5cGU+PEZpbGVUaW1lc3RhbXA+MjAyMy0wOC0yNFQxOTo0MzowNC4wNTkrMDM6MDA8L0ZpbGVUaW1lc3RhbXA+PFN0YXR1cz5ORVc8L1N0YXR1cz48Rm9yd2FyZGVkVGltZXN0YW1wPjIwMjMtMDgtMjRUMTk6NDM6MDQuMDU5KzAzOjAwPC9Gb3J3YXJkZWRUaW1lc3RhbXA+PERlbGV0YWJsZT5mYWxzZTwvRGVsZXRhYmxlPjwvRmlsZURlc2NyaXB0b3I+PEZpbGVEZXNjcmlwdG9yPjxGaWxlUmVmZXJlbmNlPjE1Nzk1NDcwMTc8L0ZpbGVSZWZlcmVuY2U+PFRhcmdldElkPk5PTkU8L1RhcmdldElkPjxVc2VyRmlsZW5hbWU+cGFpbjAzIHBhbGF1dGU8L1VzZXJGaWxlbmFtZT48RmlsZVR5cGU+WFA8L0ZpbGVUeXBlPjxGaWxlVGltZXN0YW1wPjIwMjMtMDgtMjRUMDg6MTU6NTkuNDE2KzAzOjAwPC9GaWxlVGltZXN0YW1wPjxTdGF0dXM+TkVXPC9TdGF0dXM+PEZvcndhcmRlZFRpbWVzdGFtcD4yMDIzLTA4LTI0VDA4OjE1OjU5LjQxNiswMzowMDwvRm9yd2FyZGVkVGltZXN0YW1wPjxEZWxldGFibGU+ZmFsc2U8L0RlbGV0YWJsZT48L0ZpbGVEZXNjcmlwdG9yPjxGaWxlRGVzY3JpcHRvcj48RmlsZVJlZmVyZW5jZT4xNTc5NDE1MjgxPC9GaWxlUmVmZXJlbmNlPjxUYXJnZXRJZD5OT05FPC9UYXJnZXRJZD48VXNlckZpbGVuYW1lPk5PTkUucGFsYXV0ZTwvVXNlckZpbGVuYW1lPjxQYXJlbnRGaWxlUmVmZXJlbmNlPjE1Nzk0MTUyODA8L1BhcmVudEZpbGVSZWZlcmVuY2U+PEZpbGVUeXBlPlhQPC9GaWxlVHlwZT48RmlsZVRpbWVzdGFtcD4yMDIzLTA4LTIzVDIxOjE2OjA1LjA1MyswMzowMDwvRmlsZVRpbWVzdGFtcD48U3RhdHVzPk5FVzwvU3RhdHVzPjxGb3J3YXJkZWRUaW1lc3RhbXA+MjAyMy0wOC0yM1QyMToxNjowNS4wNTMrMDM6MDA8L0ZvcndhcmRlZFRpbWVzdGFtcD48RGVsZXRhYmxlPmZhbHNlPC9EZWxldGFibGU+PC9GaWxlRGVzY3JpcHRvcj48RmlsZURlc2NyaXB0b3I+PEZpbGVSZWZlcmVuY2U+MTU3OTQwODUyNzwvRmlsZVJlZmVyZW5jZT48VGFyZ2V0SWQ+Tk9ORTwvVGFyZ2V0SWQ+PFVzZXJGaWxlbmFtZT5OT05FLnBhbGF1dGU8L1VzZXJGaWxlbmFtZT48UGFyZW50RmlsZVJlZmVyZW5jZT4xNTc5NDA4NTI1PC9QYXJlbnRGaWxlUmVmZXJlbmNlPjxGaWxlVHlwZT5YUDwvRmlsZVR5cGU+PEZpbGVUaW1lc3RhbXA+MjAyMy0wOC0yM1QyMDozMjo1My40MzgrMDM6MDA8L0ZpbGVUaW1lc3RhbXA+PFN0YXR1cz5ORVc8L1N0YXR1cz48Rm9yd2FyZGVkVGltZXN0YW1wPjIwMjMtMDgtMjNUMjA6MzI6NTMuNDM4KzAzOjAwPC9Gb3J3YXJkZWRUaW1lc3RhbXA+PERlbGV0YWJsZT5mYWxzZTwvRGVsZXRhYmxlPjwvRmlsZURlc2NyaXB0b3I+PC9GaWxlRGVzY3JpcHRvcnM+PEZpbGVUeXBlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOnN0cmluZyI+WFA8L0ZpbGVUeXBlPjwvQXBwbGljYXRpb25SZXNwb25zZT4=</mod:ApplicationResponse></cor:downloadFileListout></soapenv:Body></soapenv:Envelope>';

    const userParams: UserParamsInterface = {
      bank: 'Samlink',
      environment: 'PRODUCTION',
      customerId: '12345678',
      Base64EncodedRootCA: '',
      rejectUnauthorized: true,
    };

    const xp: XPInterface = {
      userParams: userParams,
      verifyResponseSignature: false,
      requestUrl: '',
      RequestId: '123456',
      Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
      SoftwareId: {name: 'TEST', version: '0.10.0'} as SoftwareIdInterface,
      ExecutionSerial: '434345',
      Base64EncodedClientCsr: '',
      Base64EncodedBankCsr: '',
      Base64EncodedClientPrivateKey: '',
      language: 'FI',
      fileStatus: 'NEW',
    };

    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const dfListResponse = new XPDFLApplicationResponse(xp, dfListApplicationResponseMessage);
    const parsed: XPFileDescriptor[] = await dfListResponse.parseBody();

    expect(parsed.length).to.equal(4);
    expect(parsed[0].Status).to.equal('NEW');
    expect(parsed[0].UserFilename).to.equal('pain03 palaute');
  });

});

