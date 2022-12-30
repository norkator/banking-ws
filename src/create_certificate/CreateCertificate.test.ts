// import * as mocha from 'mocha';
import * as chai from 'chai';
import {CreateOwnCertificate} from '../index';
import {CreatedCertificateInterface} from '../interfaces';
import {Base64DecodeStr} from '../utils';

const expect = chai.expect;
describe('CreateCertificate', async () => {

  it('should create certificate and contain expected structure', async () => {

    const certificate: CreatedCertificateInterface = await CreateOwnCertificate({
      twoLetterCountryCode: 'FI',
      stateOrProvince: 'Test province',
      city: 'Test city',
      companyName: 'Test company',
      companyUnitName: 'Test company unit',
      customerId: '12345678',
      emailAddress: 'test.case@example.com',
    });

    expect(certificate.clientCertificate).to.not.equal(null);
    expect(certificate.clientPrivateKey).to.not.equal(null);

    const decodedClientCert = Base64DecodeStr(certificate.clientCertificate);
    console.info(decodedClientCert);
    expect(decodedClientCert).contain('-----BEGIN CERTIFICATE REQUEST-----');
    expect(decodedClientCert).contain('-----END CERTIFICATE REQUEST-----');
  });
});

