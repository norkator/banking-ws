// import * as mocha from 'mocha';
import * as chai from 'chai';
import {
  Base64DecodeStr,
  CleanUpCertificate,
  GetCdtTrfTxInfAmtInstdAmtTotal,
  GetUuid,
  HandleResponseCode,
  x509ExpirationDate
} from './utils';

const expect = chai.expect;
describe('Utils', async () => {

  // these are generated for tests use only (dummy ones)
  const CLIENT_CERTIFICATE = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQzVUQ0NBYzBDQVFBd2daOHhDekFKQmdOVkJBWVRBa1pKTVJVd0V3WURWUVFJREF4VVpYTjBVSEp2ZG1sdQpZMlV4RVRBUEJnTlZCQWNNQ0ZSbGMzUkRhWFI1TVJrd0Z3WURWUVFLREJCVVpYTjBUM0puWVc1cGVtRjBhVzl1Ck1SVXdFd1lEVlFRTERBeFVaWE4wVlc1cGRFNWhiV1V4RVRBUEJnTlZCQU1NQ0RFeU16UTFOamM0TVNFd0h3WUoKS29aSWh2Y05BUWtCRmhKMFpYTjBhVzVuUUhSbGMzUnBibWN1Wm1rd2dnRWlNQTBHQ1NxR1NJYjNEUUVCQVFVQQpBNElCRHdBd2dnRUtBb0lCQVFEVU91VkFHVEY3dzBZRDQ2MkJnQkFTOEp4V00rSXpWeEExV1hUUlpPNmVJWnJKCjArS1hONGUxZ1FpV1NIWGkvYzZmR1YzcExBNXJyWlA1bWpPT3JnQmk1RVNuZ01IeTJQYmZUNEJQZHY5elNvaUYKZ3ZrRkxpbXJBd2cwbjFNOUV5ajU3cFA2cEplQzdGUzhsTjgyODdZMkFTL3lUbGZSZXBVU21ncFE3WlRMclJMQwppZll0U3czaFp1d0lhT3JRQ2VWYmpmOFR2eVVPcTBYTElLNHRyRWZvZHpVRG4rOUI4TE5UYldPRE55TzlZd2U0CkdYdml2VG1uVldYaisvd2tWTk4wZ0ZybitsL0xYaHduTXJNYzkrMjdXWFFtOUg3S3ViZlh1UEs0SndHRjdoREoKa2h2aCtwR1hjWGQzTjhDR3ZGdGtqdTlvWks5VEFFaXd2WDY2MDY4M0FnTUJBQUdnQURBTkJna3Foa2lHOXcwQgpBUXNGQUFPQ0FRRUFxL3lZYjl5cXJ4Z0ZJYnRYcEhocG83bXhabXpMTndmWExGa25aR2JxTmFOdUZmKytKMENICklwZkI5cjgrL3RyQlFCUGl0OWcwOXRaV3ZFSGQrMy80bTR1dkQ5VzJwQ2xtWGZWZDlyZWFwSXUraHRGRlpBK3gKOGJ3cVNqNTk5cmN0cW5FL0prbjBtNWwxZTFSOEp5RExzV3JRcnBhdWV0RnZEdko0eGZObWttUmhVYm1DVWNWSgp1eStjRzlXUGVkQm9sWE92QjlmMXFELzJzbTMyeUF2S2hMSnZpMFZwRmFrT3RBdEdlS1BiUi9Jd0VmaVU1d1BZCnpkNzZCRTRYOE1xV1Rua2Z1L1RDaVNWY25EYkVjVFJDV1ZWdDY0bERaVlgwRGx1SXU3M01OOFdrYWZhbTVUbUkKVUx0Q1B1OVNTMHM4QmcvL2RIRUhuRURLNGU0MFBydUJPZz09Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQ';
  const TEST_ROOT_CA = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUYzVENDQThXZ0F3SUJBZ0lQQVYzTDdidTFFdjRGRnQrdzU0MUxNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1FZ3gKQ3pBSkJnTlZCQVlUQWtaSk1SQXdEZ1lEVlFRS0RBZFRZVzFzYVc1ck1TY3dKUVlEVlFRRERCNVRZVzFzYVc1cgpJRk41YzNSbGJTQlVaWE4wSUZKdmIzUWdRMEVnZGpJd0hoY05NVGN3T0RFd01URXpORE00V2hjTk5ESXdPREV3Ck1URXpORE00V2pCSU1Rc3dDUVlEVlFRR0V3SkdTVEVRTUE0R0ExVUVDZ3dIVTJGdGJHbHVhekVuTUNVR0ExVUUKQXd3ZVUyRnRiR2x1YXlCVGVYTjBaVzBnVkdWemRDQlNiMjkwSUVOQklIWXlNSUlDSWpBTkJna3Foa2lHOXcwQgpBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUFqbWNyYSsxZmlUbzhBdWFUK2psMFBjL2JXbkZvUTFoM0daK095SWJKCjBaUEMyOTJhejhiUVVWcHJYWmZXZ2p5ODV4ek5nKzlHQlhTVkdzdlZHUnF4SHlobDdKbTdPMGovTUN5dktibWIKdHp6MTJRMnRCNjF5cTJ4b1NRMFhxVWVPWGNkWnI0ejF3WktPVmJLcVl6aVFkeVJyTU9SWVZya1hGYys1Wk1LUgp5SXV0UVBuOE9lQm1wclE3N0FuWmZHZEEzTndaalpFVEFwdEwydkR4MkdxVlhqdm1TbkJwVFJOVUZUT3BSdmQ5CnVJN0RJT3FQS3dyWGZvNHluK3VJTVRvRlR3TWxpbHVNTmFiNTBkcFRRT3JIZFZUck1IVzZJOVlHdWswczYrZEQKdmxSaWxNRFdwdW5VOGxHM3VpR2hiK2g0VWtuY0MrS0NJcWExcVJaUiswcE04Lzk5VlZlZkJIeDViM0x0Ky9jZgpkR3NESy9rcW9HenkyVlQyeDJ3UFBvUlB4V3FjendkcWtwT3phVlVTVGtyUzJZMzVwQ3JqZXFMTFJqQTFxNFFwCnpkTUFETEp6QzE1RlBsMitld2huNHFQUk53VDFGUm5Fa0E2QVNuRTJ6UWFBalk3YWV2d1pYRkRpa3hQZWU4R28KT1VQS28wVm5VQStiTm9XQXJMc0h0N0FmdzZEMWxQc2g5ZlFTKytycmZ0cXJKMzZHcGhMbWc2QWd1RVovNkpsYgpjL2lIRXRtenlvd3lhWmd6UEg2eGJPRjhUZEcxZU1XMWt6RmFOdnBBaC9aSTJ0ZVNlSVh2TkJEczlvZzZLZlp5ClFoMDYzS2daMUc4VFl6OGp5L3FXcjlEZHFTL1NrTWl3dmUxbzBVUmw4clNCT2dycjE1bUUzWW1qcHJwOVdxNEMKaW04Q0F3RUFBYU9Cd3pDQndEQitCZ05WSFNNRWR6QjFnQlFFUHQrMFlRRHB0dEpueEY2Snk5UlpBckRGeTZGTQpwRW93U0RFTE1Ba0dBMVVFQmhNQ1Jra3hFREFPQmdOVkJBb01CMU5oYld4cGJtc3hKekFsQmdOVkJBTU1IbE5oCmJXeHBibXNnVTNsemRHVnRJRlJsYzNRZ1VtOXZkQ0JEUVNCMk1vSVBBVjNMN2J1MUV2NEZGdCt3NTQxTE1CMEcKQTFVZERnUVdCQlFFUHQrMFlRRHB0dEpueEY2Snk5UlpBckRGeXpBT0JnTlZIUThCQWY4RUJBTUNBUVl3RHdZRApWUjBUQVFIL0JBVXdBd0VCL3pBTkJna3Foa2lHOXcwQkFRc0ZBQU9DQWdFQVV3emJqcG9Vb1dsejFBTTVua3JGCkFvV2RzYkZhWkhKdk1HdFB5MjQ5VHF2SWJBeCtpN3VXbjd4OFVtVnJiNlcyZ0FnbmF6eWxzeUEwWjVOcWdacnIKQmdvUE9KREVZUWdxbHVTS3N5UzlCS09iNjAxZGUvSGtXa20vd1lUSXp1bE5yNjMyVzlTNkpuR2ZKYlR4RzVyMwpOVGZEbmppYWl3S1Yzb2ZrakdXanVCNm8xWVNCQWdLc0ZRekQ1bjN3N0FKSmtYcFdWMWRsWGh3WGpoejRubEMzCm1vdEhFVWhmc0dWK2xyS2s5Y2QvUG5JM2lBM3E0S1pqNmtiVlVWUmFHL014L2pWcENZRzI0bm12Rys5SkZ3dlcKYXQrcURkY2tMR3VIeG9xWHhnUGN4ankxSGxiS3V0ZlBma3cvam9ndTFubEE4ZXVlV2ZNY215cG9OdnRvOUlCWApOT3haTm5NazhscVZEL3FJY0J5NW01L2RoN3Z2b3FKRUJYTEFrMTNpejhrRXdmNjQ5dldCOFlyS2ExeWpoMG9WClRaS25aa0dEdzUyRFVESHd5TU9VZ3lva1Z6djk2VGJRazY3VGV0ZnJrNWx3L2tvN2pHeEFoOGI2VWxCV3JiZkkKWFRCWWUwTS9KR0QveDFNU0JBZncxZXhwN3dnYVRkcnZUOVNFdy9qUFdudis2clFOT3huaWl6c1gzUW5JUXJXbQo3REI5MURWSUkxVThiYnFPQ1N0ckx2WWdqcVhrV01RNHEyUjd2M0Z0QUw2RHFWYy9FRTN1R0Nza3pOMHcrVGExCk0yS25TZFRQMzZSalRwMXp4alJaTm9jeVRGK0k1MkNQeXEvc1JLSEhvdTBjYW5KOFFUdlVQYzcwSklDUW1RWjQKNjB6d0VXdytOOUFoOWZFK25wUmZBYVU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0=';


  it('should clean up certificate', async () => {
    const c = CleanUpCertificate(CLIENT_CERTIFICATE);
    expect(c).not.include('-----BEGIN CERTIFICATE REQUEST-----');
    expect(c).not.include('-----END CERTIFICATE REQUEST-----');
  });

  it('should determine X509 expiration date', async () => {
    const exp = await x509ExpirationDate(Base64DecodeStr(TEST_ROOT_CA));
    expect(exp).to.equal('2042-08-10 11:34:38');
  });

  it('should return correct total amounts', async () => {
    expect(GetCdtTrfTxInfAmtInstdAmtTotal(250)).to.equal('250.00');
    expect(GetCdtTrfTxInfAmtInstdAmtTotal(5000)).to.equal('5000.00');
    expect(GetCdtTrfTxInfAmtInstdAmtTotal(1234.50)).to.equal('1234.50');
    expect(GetCdtTrfTxInfAmtInstdAmtTotal(0.95)).to.equal('0.95');
  });

  it('should throw error for invalid response code test 1', async () => {
    const invalidCode = '2';
    const responseText = 'SOAP signature error';
    const testFunction = () => HandleResponseCode(invalidCode, responseText);
    expect(testFunction).to.throw(Error, `Code ${invalidCode} / ${responseText}`);
  });

  it('should throw error for invalid response code test 2', async () => {
    const invalidCode = '32';
    const responseText = 'Duplicate request rejected';
    const testFunction = () => HandleResponseCode(invalidCode, responseText);
    expect(testFunction).to.throw(Error, `Code ${invalidCode} / ${responseText}`);
  });

  it('should not throw error for response code', async () => {
    const invalidCode = '0';
    const responseText = 'OK';
    const testFunction = () => HandleResponseCode(invalidCode, responseText);
    expect(testFunction).to.not.throw();
  });

  it('should give uuid with expected prefix', async () => {
    const uuid = GetUuid('B');
    expect(uuid).to.contain('B-');
    expect(uuid.length).to.greaterThan(30);
  });

});
