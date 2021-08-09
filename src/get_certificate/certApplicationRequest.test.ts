import * as mocha from 'mocha';
import * as chai from 'chai';
import {GetCertificateInterface, SoftwareIdInterface} from '../interfaces';
import {CertApplicationRequest} from './certApplicationRequest';
import {Base64EncodeStr, LoadFileAsString} from '../utils';
import * as path from 'path';

const expect = chai.expect;
describe('CertApplicationRequest', async () => {

  it('should return expected xml structure with initial GetCertificate option', async () => {
    const expectedGetCertificateXml = '<?xml version="1.0"?>\n' +
      '<CertApplicationRequest xmlns="http://op.fi/mlp/xmldata/">\n' +
      '  <CustomerId>12345678</CustomerId>\n' +
      '  <Timestamp>2021-08-06T01:01:48+03:00</Timestamp>\n' +
      '  <Environment>PRODUCTION</Environment>\n' +
      '  <SoftwareId>TEST-0.9.0</SoftwareId>\n' +
      '  <Command>GetCertificate</Command>\n' +
      '  <Service>ISSUER</Service>\n' +
      '  <Content>LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQzVUQ0NBYzBDQVFBd2daOHhDekFKQmdOVkJBWVRBa1pKTVJVd0V3WURWUVFJREF4VVpYTjBVSEp2ZG1sdQpZMlV4RVRBUEJnTlZCQWNNQ0ZSbGMzUkRhWFI1TVJrd0Z3WURWUVFLREJCVVpYTjBUM0puWVc1cGVtRjBhVzl1Ck1SVXdFd1lEVlFRTERBeFVaWE4wVlc1cGRFNWhiV1V4RVRBUEJnTlZCQU1NQ0RFeU16UTFOamM0TVNFd0h3WUoKS29aSWh2Y05BUWtCRmhKMFpYTjBhVzVuUUhSbGMzUnBibWN1Wm1rd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQQpBNElCRHdBd2dnRUtBb0lCQVFEVU91VkFHVEY3dzBZRDQ2MkJnQkFTOEp4V00rSXpWeEExV1hUUlpPNmVJWnJKCjArS1hONGUxZ1FpV1NIWGkvYzZmR1YzcExBNXJyWlA1bWpPT3JnQmk1RVNuZ01IeTJQYmZUNEJQZHY5elNvaUYKZ3ZrRkxpbXJBd2cwbjFNOUV5ajU3cFA2cEplQzdGUzhsTjgyODdZMkFTL3lUbGZSZXBVU21ncFE3WlRMclJMQwppZll0U3czaFp1d0lhT3JRQ2VWYmpmOFR2eVVPcTBYTElLNHRyRWZvZHpVRG4rOUI4TE5UYldPRE55TzlZd2U0CkdYdml2VG1uVldYaisvd2tWTk4wZ0ZybitsL0xYaHduTXJNYzkrMjdXWFFtOUg3S3ViZlh1UEs0SndHRjdoREoKa2h2aCtwR1hjWGQzTjhDR3ZGdGtqdTlvWks5VEFFaXd2WDY2MDY4M0FnTUJBQUdnQURBTkJna3Foa2lHOXcwQgpBUXNGQUFPQ0FRRUFxL3lZYjl5cXJ4Z0ZJYnRYcEhocG83bXhabXpMTndmWExGa25aR2JxTmFOdUZmKytKMENICklwZkI5cjgrL3RyQlFCUGl0OWcwOXRaV3ZFSGQrMy80bTR1dkQ5VzJwQ2xtWGZWZDlyZWFwSXUraHRGRlpBK3gKOGJ3cVNqNTk5cmN0cW5FL0prbjBtNWwxZTFSOEp5RExzV3JRcnBhdWV0RnZEdko0eGZObWttUmhVYm1DVWNWSgp1eStjRzlXUGVkQm9sWE92QjlmMXFELzJzbTMyeUF2S2hMSnZpMFZwRmFrT3RBdEdlS1BiUi9Jd0VmaVU1d1BZCnpkNzZCRTRYOE1xV1Rua2Z1L1RDaVNWY25EYkVjVFJDV1ZWdDY0bERaVlgwRGx1SXU3M01OOFdrYWZhbTVUbUkKVUx0Q1B1OVNTMHM4QmcvL2RIRUhuRURLNGU0MFBydUJPZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=</Content>\n' +
      '  <TransferKey>1234567812345678</TransferKey>\n' +
      '</CertApplicationRequest>';

    const gc: GetCertificateInterface = {
      userParams: {
        bank: 'Samlink',
        environment: 'PRODUCTION',
        customerId: '12345678',
        rootCAPath: '',
      },
      requestUrl: '',
      Timestamp: '2021-08-06T01:01:48+03:00',
      SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
      Command: 'GetCertificate',
      CsrPath: path.join(__dirname + '/../../' + '/tests/signing.csr'),
      TransferKey: '1234567812345678',
      RequestId: '123456'
    };

    const certRequest = new CertApplicationRequest(gc);
    const getCertificateXml = await certRequest.createXmlBody();

    expect(getCertificateXml).to.equal(expectedGetCertificateXml);
  });


  it('should return expected xml structure with RenewCertificate option', async () => {
    const expectedRenewCertificateXml = '<?xml version="1.0"?><CertApplicationRequest xmlns="http://op.fi/mlp/xmldata/"><CustomerId>12345678</CustomerId><Timestamp>2021-08-06T01:01:48+03:00</Timestamp><Environment>PRODUCTION</Environment><SoftwareId>TEST-0.9.0</SoftwareId><Command>RenewCertificate</Command><Service>ISSUER</Service><Content>LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQzVUQ0NBYzBDQVFBd2daOHhDekFKQmdOVkJBWVRBa1pKTVJVd0V3WURWUVFJREF4VVpYTjBVSEp2ZG1sdQpZMlV4RVRBUEJnTlZCQWNNQ0ZSbGMzUkRhWFI1TVJrd0Z3WURWUVFLREJCVVpYTjBUM0puWVc1cGVtRjBhVzl1Ck1SVXdFd1lEVlFRTERBeFVaWE4wVlc1cGRFNWhiV1V4RVRBUEJnTlZCQU1NQ0RFeU16UTFOamM0TVNFd0h3WUoKS29aSWh2Y05BUWtCRmhKMFpYTjBhVzVuUUhSbGMzUnBibWN1Wm1rd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQQpBNElCRHdBd2dnRUtBb0lCQVFEVU91VkFHVEY3dzBZRDQ2MkJnQkFTOEp4V00rSXpWeEExV1hUUlpPNmVJWnJKCjArS1hONGUxZ1FpV1NIWGkvYzZmR1YzcExBNXJyWlA1bWpPT3JnQmk1RVNuZ01IeTJQYmZUNEJQZHY5elNvaUYKZ3ZrRkxpbXJBd2cwbjFNOUV5ajU3cFA2cEplQzdGUzhsTjgyODdZMkFTL3lUbGZSZXBVU21ncFE3WlRMclJMQwppZll0U3czaFp1d0lhT3JRQ2VWYmpmOFR2eVVPcTBYTElLNHRyRWZvZHpVRG4rOUI4TE5UYldPRE55TzlZd2U0CkdYdml2VG1uVldYaisvd2tWTk4wZ0ZybitsL0xYaHduTXJNYzkrMjdXWFFtOUg3S3ViZlh1UEs0SndHRjdoREoKa2h2aCtwR1hjWGQzTjhDR3ZGdGtqdTlvWks5VEFFaXd2WDY2MDY4M0FnTUJBQUdnQURBTkJna3Foa2lHOXcwQgpBUXNGQUFPQ0FRRUFxL3lZYjl5cXJ4Z0ZJYnRYcEhocG83bXhabXpMTndmWExGa25aR2JxTmFOdUZmKytKMENICklwZkI5cjgrL3RyQlFCUGl0OWcwOXRaV3ZFSGQrMy80bTR1dkQ5VzJwQ2xtWGZWZDlyZWFwSXUraHRGRlpBK3gKOGJ3cVNqNTk5cmN0cW5FL0prbjBtNWwxZTFSOEp5RExzV3JRcnBhdWV0RnZEdko0eGZObWttUmhVYm1DVWNWSgp1eStjRzlXUGVkQm9sWE92QjlmMXFELzJzbTMyeUF2S2hMSnZpMFZwRmFrT3RBdEdlS1BiUi9Jd0VmaVU1d1BZCnpkNzZCRTRYOE1xV1Rua2Z1L1RDaVNWY25EYkVjVFJDV1ZWdDY0bERaVlgwRGx1SXU3M01OOFdrYWZhbTVUbUkKVUx0Q1B1OVNTMHM4QmcvL2RIRUhuRURLNGU0MFBydUJPZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=</Content><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#WithComments"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI="" xmlns="http://www.w3.org/2000/09/xmldsig#"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" xmlns="http://www.w3.org/2000/09/xmldsig#"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" xmlns="http://www.w3.org/2000/09/xmldsig#"/><DigestValue xmlns="http://www.w3.org/2000/09/xmldsig#">fBgLJcmoDKE+lSRHtFCwL9F4XKI=</DigestValue></Reference></SignedInfo><SignatureValue xmlns="http://www.w3.org/2000/09/xmldsig#">vK0Rzywp0SujRGSaZMj/Ur9x3GRkonI+IXqH/wa7/Wu9ltaKzFd4a2N82RXqCLk60P4FvpqpyikSEhI9Q4JBp7mbAFLGJCo0Ly4dWqFgH2CbKfNosxiAuXNVFmHYCnuoHGTJ/vrF6is1ncd7BNHHhlCD5aJJHDYET+yhsEUeKTtDP7qHn3vdQYN2tz10h7jemO3ql89ICMiuTKdTQOz9PnRB6zkRxgSRKQTp65y1x/aClJvNmRNCsgAY8y0sSkwupWYgH6z8k58qasWurxdQpEfCABwJwJEayKbU7KspBEwVR/kaPSuNHnnT3AIdmxtElCc50JU5v8IuQh7nUje26g==</SignatureValue><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Certificate xmlns="http://www.w3.org/2000/09/xmldsig#">\n' +
      'MIIC5TCCAc0CAQAwgZ8xCzAJBgNVBAYTAkZJMRUwEwYDVQQIDAxUZXN0UHJvdmlu\n' +
      'Y2UxETAPBgNVBAcMCFRlc3RDaXR5MRkwFwYDVQQKDBBUZXN0T3JnYW5pemF0aW9u\n' +
      'MRUwEwYDVQQLDAxUZXN0VW5pdE5hbWUxETAPBgNVBAMMCDEyMzQ1Njc4MSEwHwYJ\n' +
      'KoZIhvcNAQkBFhJ0ZXN0aW5nQHRlc3RpbmcuZmkwggEiMA0GCSqGSIb3DQEBAQUA\n' +
      'A4IBDwAwggEKAoIBAQDUOuVAGTF7w0YD462BgBAS8JxWM+IzVxA1WXTRZO6eIZrJ\n' +
      '0+KXN4e1gQiWSHXi/c6fGV3pLA5rrZP5mjOOrgBi5ESngMHy2PbfT4BPdv9zSoiF\n' +
      'gvkFLimrAwg0n1M9Eyj57pP6pJeC7FS8lN8287Y2AS/yTlfRepUSmgpQ7ZTLrRLC\n' +
      'ifYtSw3hZuwIaOrQCeVbjf8TvyUOq0XLIK4trEfodzUDn+9B8LNTbWODNyO9Ywe4\n' +
      'GXvivTmnVWXj+/wkVNN0gFrn+l/LXhwnMrMc9+27WXQm9H7KubfXuPK4JwGF7hDJ\n' +
      'khvh+pGXcXd3N8CGvFtkju9oZK9TAEiwvX660683AgMBAAGgADANBgkqhkiG9w0B\n' +
      'AQsFAAOCAQEAq/yYb9yqrxgFIbtXpHhpo7mxZmzLNwfXLFknZGbqNaNuFf++J0CH\n' +
      'IpfB9r8+/trBQBPit9g09tZWvEHd+3/4m4uvD9W2pClmXfVd9reapIu+htFFZA+x\n' +
      '8bwqSj599rctqnE/Jkn0m5l1e1R8JyDLsWrQrpauetFvDvJ4xfNmkmRhUbmCUcVJ\n' +
      'uy+cG9WPedBolXOvB9f1qD/2sm32yAvKhLJvi0VpFakOtAtGeKPbR/IwEfiU5wPY\n' +
      'zd76BE4X8MqWTnkfu/TCiSVcnDbEcTRCWVVt64lDZVX0DluIu73MN8Wkafam5TmI\n' +
      'ULtCPu9SS0s8Bg//dHEHnEDK4e40PruBOg==</X509Certificate></X509Data></KeyInfo></Signature></CertApplicationRequest>';

    const gcr: GetCertificateInterface = {
      userParams: {
        bank: 'Samlink',
        environment: 'PRODUCTION',
        customerId: '12345678',
        rootCAPath: '',
      },
      requestUrl: '',
      Timestamp: '2021-08-06T01:01:48+03:00',
      SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
      Command: 'RenewCertificate',
      CsrPath: path.join(__dirname + '/../../' + '/tests/signing.csr'),
      TransferKey: '1234567812345678',
      RequestId: '123456',
      BankCsrPath: path.join(__dirname + '/../../' + '/tests/signing.csr'), // using same signing.csr, real request would fail
      Base64EncodedClientPrivateKey: Base64EncodeStr(LoadFileAsString(path.join(__dirname + '/../../' + '/tests/signing.key')))
    };

    const renewCertRequest = new CertApplicationRequest(gcr);
    const renewCertificateXml = await renewCertRequest.createXmlBody();

    expect(renewCertificateXml).to.equal(expectedRenewCertificateXml);
  });


});
