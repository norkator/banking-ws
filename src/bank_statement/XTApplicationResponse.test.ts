import * as chai from 'chai';
import {SoftwareIdInterface, XTInterface} from '../interfaces';
import {XTApplicationResponse} from './XTApplicationResponse';

const expect = chai.expect;
describe('XTApplicationResponse', async () => {

  it('should return expected bank statement file descriptor details', async () => {
    const xtApplicationResponseMessage = '<?xml version=\'1.0\' encoding=\'UTF-8\'?><soapenv:Envelope xmlns:cor="http://bxd.fi/CorporateFileService" xmlns:mod="http://model.bxd.fi" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="id-48addc8c-c297-45e3-b15a-91f9d1660ec4"><cor:downloadFileListout><mod:ResponseHeader><mod:SenderId>97357407</mod:SenderId><mod:RequestId>123456</mod:RequestId><mod:Timestamp>2023-08-28T09:43:37.829</mod:Timestamp><mod:ResponseCode>00</mod:ResponseCode><mod:ResponseText>OK</mod:ResponseText><mod:ReceiverId></mod:ReceiverId></mod:ResponseHeader><mod:ApplicationResponse>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PEFwcGxpY2F0aW9uUmVzcG9uc2UgeG1sbnM9Imh0dHA6Ly9ieGQuZmkveG1sZGF0YS8iIHhtbG5zOm5zMj0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyI+PEN1c3RvbWVySWQ+OTczNTc0MDc8L0N1c3RvbWVySWQ+PFRpbWVzdGFtcD4yMDIzLTA4LTI4VDA5OjQzOjM3LjcwMyswMzowMDwvVGltZXN0YW1wPjxSZXNwb25zZUNvZGU+MDA8L1Jlc3BvbnNlQ29kZT48UmVzcG9uc2VUZXh0Pk9LPC9SZXNwb25zZVRleHQ+PEV4ZWN1dGlvblNlcmlhbD4xMjM0NTY8L0V4ZWN1dGlvblNlcmlhbD48RW5jcnlwdGVkPmZhbHNlPC9FbmNyeXB0ZWQ+PENvbXByZXNzZWQ+ZmFsc2U8L0NvbXByZXNzZWQ+PEZpbGVEZXNjcmlwdG9ycz48RmlsZURlc2NyaXB0b3I+PEZpbGVSZWZlcmVuY2U+MTUzNjc5NDUyNjwvRmlsZVJlZmVyZW5jZT48VGFyZ2V0SWQ+Tk9ORTwvVGFyZ2V0SWQ+PFVzZXJGaWxlbmFtZT5TVE9MMDAxLk9MVENYNjBILkNBTVQwNTMuUFM8L1VzZXJGaWxlbmFtZT48RmlsZVR5cGU+WFQ8L0ZpbGVUeXBlPjxGaWxlVGltZXN0YW1wPjIwMjMtMDYtMzBUMjE6MjM6NDQuNjc4KzAzOjAwPC9GaWxlVGltZXN0YW1wPjxTdGF0dXM+TkVXPC9TdGF0dXM+PEZvcndhcmRlZFRpbWVzdGFtcD4yMDIzLTA2LTMwVDIxOjIzOjQ0LjY3OCswMzowMDwvRm9yd2FyZGVkVGltZXN0YW1wPjxEZWxldGFibGU+ZmFsc2U8L0RlbGV0YWJsZT48L0ZpbGVEZXNjcmlwdG9yPjwvRmlsZURlc2NyaXB0b3JzPjxGaWxlVHlwZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czpzdHJpbmciPlhUPC9GaWxlVHlwZT48L0FwcGxpY2F0aW9uUmVzcG9uc2U+</mod:ApplicationResponse></cor:downloadFileListout></soapenv:Body></soapenv:Envelope>';

    const xt: XTInterface = {
      userParams: {
        bank: 'Samlink',
        environment: 'PRODUCTION',
        customerId: '97357407',
        Base64EncodedRootCA: '',
        rejectUnauthorized: true,
      },
      verifyResponseSignature: false,
      Base64EncodedBankCsr: '',
      requestUrl: '',
      Timestamp: '2021-08-06T01:01:48+03:00',
      SoftwareId: {name: 'TEST', version: '0.0.0'} as SoftwareIdInterface,
      ExecutionSerial: '',
      Base64EncodedClientCsr: '',
      RequestId: '123456',
      language: 'FI',
    };

    const xtResponse = new XTApplicationResponse(xt, xtApplicationResponseMessage);
    const parsed = await xtResponse.parseBody();

    expect(parsed.FileReference).to.equal('1536794526');
    expect(parsed.TargetId).to.equal('NONE');
    expect(parsed.UserFilename).to.equal('STOL001.OLTCX60H.CAMT053.PS');
    expect(parsed.FileType).to.equal('XT');
    expect(parsed.FileTimestamp).to.equal('2023-06-30T21:23:44.678+03:00');
    expect(parsed.Status).to.equal('NEW');
    expect(parsed.ForwardedTimestamp).to.equal('2023-06-30T21:23:44.678+03:00');
    expect(parsed.Deletable).to.equal('false');
  });

});

