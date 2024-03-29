// import * as mocha from 'mocha';
import * as chai from 'chai';
import {CreateOwnCertificate, CheckOwnCertificate} from '../index';
import {CreateCertificateInterface, CreatedCertificateInterface} from '../interfaces';
import {Base64DecodeStr} from '../utils/utils';

const cc: CreateCertificateInterface = {
  twoLetterCountryCode: 'FI',
  stateOrProvince: 'Test province',
  city: 'Test city',
  companyName: 'Test company',
  companyUnitName: 'Test company unit',
  customerId: '12345678',
  emailAddress: 'test.case@example.com',
}

const expect = chai.expect;
describe('CreateCertificate', async () => {

  it('should create certificate and contain expected structure', async () => {
    const certificate: CreatedCertificateInterface = await CreateOwnCertificate(cc);

    expect(certificate.clientCertificate).to.not.equal(null);
    expect(certificate.clientPrivateKey).to.not.equal(null);

    const decodedClientCert = Base64DecodeStr(certificate.clientCertificate);
    // console.info(decodedClientCert);
    expect(decodedClientCert).contain('-----BEGIN CERTIFICATE REQUEST-----');
    expect(decodedClientCert).contain('-----END CERTIFICATE REQUEST-----');
  });


  it('should create certificate and contain expected infomation', async () => {
    const certInfo = await CheckOwnCertificate(cc);
    // console.info(certInfo);
    expect(certInfo).contain('Test city');
    expect(certInfo).contain('Test company');
    expect(certInfo).contain('Test company unit');
    expect(certInfo).contain('12345678');
    expect(certInfo).contain('test.case@example.com');
    expect(certInfo).contain('Signature Algorithm: sha256WithRSAEncryption');
  });
});

