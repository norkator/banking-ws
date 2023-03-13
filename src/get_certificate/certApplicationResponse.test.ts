import * as chai from 'chai';
import {CertApplicationResponse} from './certApplicationResponse';
import {LoadFileAsString} from '../utils/utils';
import * as path from 'path';
import {GetCertificateInterface, SoftwareIdInterface} from '../interfaces';

const TEST_CERTIFICATE = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUUxekNDQXIrZ0F3SUJBZ0lQQVlXSi93cXF2eEdIVXowV2UrWnlNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1Fa3hDekFKQmdOVkJBWVQKQWtaSk1SQXdEZ1lEVlFRS0RBZFRZVzFzYVc1ck1TZ3dKZ1lEVlFRRERCOVRZVzFzYVc1cklGTjVjM1JsYlNCVVpYTjBJRU4xYzNSdgpiV1Z5SUVOQk1CNFhEVEl6TURFd056QXlNVEV4TUZvWERUSXpNRE13T1RBeU1URXhNRm93WHpFTE1Ba0dBMVVFQmhNQ1Jra3hKakFrCkJnTlZCQW9USFVGcGJtVnBjM1J2Y0dGc2RtVnNkWFF0VTJGaGMzUnZjR0Z1YTJ0cE1SVXdFd1lEVlFRREV3eEdTVTVCVGxORlRFd2cKVDFreEVUQVBCZ05WQkFRVENEazNNelUzTkRBM01JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBMVY2MAp6TmVFbTZKMU9XOHFTb2o1VUN5eDUyVnJoaEh6V3UyeWcvU1pnZFhUaUhWMElCMXJUa0lhQ2JUNnVQYkFPb3NmcWxwR012R0V4bUVYCjBzR0ZuRTNablluS1o4cnFPZk1hMWpzekNyVnpNUVZkUGxzL0M1K3V3d1NudE4zMy94N2lsVTlpV0Z5NnBxeS9pRzU0andmQU1WUGIKNXliOHp5bW5uUkc1T1o3WGxxc20vbmVUMlc5ZENXa0xFeDhndGdmWFpRZ3lJVDM1YXppcTh1NTVrWmlwWGh5TjUveVNMUU9kdTNzWQpFOVcvdVN1SUNUbVN5bkYwSlhjNGEzaGZ5dnRMblZhRzI5VWIxSkN3UFdWZXdWSXBNTTdHU3dWbkpVNkNSZjRwWkxXMGEzbWVRNzU3CnZ6YytITWgvV2xDYWxaVzZvSXFoNkpCZjZCdG0zQVZuUXdJREFRQUJvNEdsTUlHaU1COEdBMVVkSXdRWU1CYUFGQUtxREo2OTZVaUIKSndnbzV1amVGUGNWakxtMk1CMEdBMVVkRGdRV0JCUkl6YjdQWlg4eE5adjk5aUlvUXhsZUZOV2lXREFPQmdOVkhROEJBZjhFQkFNQwpCUEF3VUFZRFZSMGZCRWt3UnpCRm9FT2dRWVkvSUdoMGRIQTZMeTlvZEhSd1kzSnNMblJ5ZFhOMExuUmxiR2xoTG1OdmJTOXpZVzFzCmFXNXJjM2x6ZEdWdGRHVnpkR04xYzNSdmJXVnlZMkV1WTNKc01BMEdDU3FHU0liM0RRRUJDd1VBQTRJQ0FRQ050ODI1aGtXc3F4RlMKYi82WGplbWdyU2dzSC9ZOXQwWlRKanBTT1dWSzVXOVNCWDNzM2prQ2o0NnBZK1ZvVVVUbDNITHdSL2JObkcrd2pwSGZ3a1RvU2lLVgovcTg4NklKaGY5WE1VaUZ3cnVxS21TQTFRNGpjamljNFNCejFnVm5nR2ZLeFUvYzgveFlvMFVaZFlPblVPc0w4QTMyVDlxbkJOUHBsCk16ZG5OQU5tdU9yNEhkVUlCZnhRdVVsNnJkM2RsaWV2RmtqM0JMT3BkT3E1bVFjTHYxMnVDUnlPb1dVcFZ3RWNqQm5TRk9PSmlvcTEKV1NUbGZZUnZRMkdNM09JTWRVc2ZyRXUrdzhPblhESDlKcDNKaUhqSk1iRVRrOEwvZzlrdUg2YTlmbUJFcWtxR0toZDg3QWEwc3MrcApSK1M4ZUl5WDE5Vk5nc3hVY3A3YnFWY1Fzdjh5NWxCOFFHdndKUlQyOGlxTTZtQ1RIRlhadTNLUmtIK0JST2cxaExkV0FoMGk5Q21YCmpHSVhKWXBrRU05Kzh4TGM4eldVQmVDUVdyYjgySXBmV1pqYkpvRDREZmloUmh2a0pjMC8vNWkzem9jSUlRcFlTdzRvdWtwYWdWaTIKa3Q3ZElHZDRDL1hGTXFoT21Za0VIWWNHV0x4STdIZnRVcGl2dkFlQ3RQVUhBK29EalNoUEt2M0FxK3hJSkNRTHZldm9TK2d5NEdGSgoyZEtIM1hadDVaWXdiZ1kwYmZDWHFCaWdoRm5kZ1lGcnl4akZvMGZjbldzVC8yUVIrY25rdy9yd2VqNzRIRmh4UUlqVEd0elV1YldLCjhpRW52c3NzS3lrUGNpM1J4VjlSZHVHK2VnMmR1c2k5U05zdy82RW9VK1pTalNzcjJkRlJoRGNLTGM2UjVBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=';

const expect = chai.expect;
describe('CertApplicationResponse', async () => {

  it('should return expected certificate details from get certificate response', async () => {
    const gc: GetCertificateInterface = {
      userParams: {
        bank: 'Samlink',
        environment: 'PRODUCTION',
        customerId: '97357407',
        Base64EncodedRootCA: '',
        rejectUnauthorized: true,
      },
      requestUrl: '',
      Timestamp: '2021-08-06T01:01:48+03:00',
      SoftwareId: {name: 'TEST', version: '0.0.0'} as SoftwareIdInterface,
      Command: 'GetCertificate',
      Base64EncodedClientCsr: '',
      TransferKey: '1234567812345678',
      RequestId: '123456'
    };

    const response = {
      data: LoadFileAsString(path.join(__dirname + '/' + 'get_certificate_response_test.xml'))
    };
    const car = new CertApplicationResponse(gc, response.data);
    const certificate = await car.parseBody();

    expect(certificate.Name).to.equal('SURNAME=97357407, CN=FINANSELL OY, O=Aineistopalvelut-Saastopankki, C=FI');
    expect(certificate.Certificate).to.equal(TEST_CERTIFICATE);
    expect(certificate.CertificateFormat).to.equal('X509');
    expect(certificate.ExpirationDateTime).to.equal('2023-03-09 02:11:10');
  });

});

