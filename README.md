# Banking-ws

<b>Work in progress for long time!</b>

Library to construct, validate and make corporate banking web service request with SOAP.

Supported banks
-----
* Banks supported by Samlink.


Table of contents
=================
* [Resources](#resources)
    * [Links](#links)
    * [Documents](#documents)
* [Installing](#installing)
* [Terminology](#terminology)
* [Getting Started](#getting-started)
* [Examples](#examples)
    * [Generate new certificate](#generate-new-certificate)
    * [Get certificate](#get-certificate)
    * [Renew certificate](#renew-certificate)
    * [Bank Statement](#bank-statement)
    * [SEPA Payment](#sepa-payment)
    * [SEPA Errors](#sepa-errors)
    


Resources
============

Links
-----
* [http://xsd2xml.com/](http://xsd2xml.com/) is handy for converting `xsd` schemas to `xml` samples.  
* [Sepa XML validation](https://www.mobilefish.com/services/sepa_xml_validation/sepa_xml_validation.php) is handy for validating SEPA `pain` messages.
* [Chilkat - xmlDsigVerify](https://tools.chilkat.io/xmlDsigVerify.cshtml) lifesaver with XML signature  verification. The only tool which gave confidence.

Documents
-----
See under `./documents` folder.



Installing
============
1. Mac and Linux already has OpenSSL pre installed but with Windows you need to download binary somewhere like [here](https://slproweb.com/products/Win32OpenSSL.html).
    * Then add its binary to your system path variable `;C:\Program Files\OpenSSL-Win64\bin`
2. ...

```shell script
todo...
```


Terminology
============
* `SAMLINK_TEST_ROOT_CA` is used with axios ca config at Samlink test side. Taken from Samlink documentation provided with customerId.
* `BANK_CERTIFICATE` is a base64 encoded certificate get after initial GetCertificate command and new ones after RenewCertificate.
* `CLIENT_CERTIFICATE` is signing certificate you have created with OpenSSL.
* `CLIENT_PRIVATE_KEY` is private key for upper signing certificate you created with OpenSSL


Getting started
============
You need certificates from your bank which is got with get certificate request. 
To make request you first need: 

* Your own generated signing certificate.
* Private key for your signing certificate.

Then you need to get your bank to sign your signing/encryption certificate(s). For this you need to make

* Your signing certificate signing request

### Generating your own CSR

You can generate your certificate signing requests with `openssl`

```bash
openssl req -out signing.csr -new -newkey rsa:2048 -nodes -keyout signing.key
```

After this, you should have following files:

```
signing.csr  (CLIENT_CERTIFICATE)
signing.key  (CLIENT_PRIVATE_KEY)
```

### Getting test credentials and firewall rule
* You cannot use this without Samlink opening firewall rule to allow you making request behind your public ip.
* You need to ask Samlink for customer id and one time use transfer key.



Examples
============
Below are examples for each step.


Generate new certificate
-----

#### Creating
Note that `customerId` must be exact Samlink customer id.
```typescript
import {CreatedCertificateInterface} from './src/interfaces';
import {CreateOwnCertificate} from './src/index';

CreateOwnCertificate({
  twoLetterCountryCode: 'FI',
  stateOrProvince: 'Province',
  city: 'City',
  companyName: 'Company name',
  companyUnitName: 'Company unit',
  customerId: '12345678',
  emailAddress: 'somemail@company.fi',
}).then((certificate: CreatedCertificateInterface) => {
  console.log(certificate);
});
```

#### Expected response
```json5
{
  clientCertificate: 'base64-encoded-content',
  clientPrivateKey: 'base64-encoded-content'
}
```
You can decode `clientCertificate` and then its pem base64 and then see 
that your given parameters exists.


Get certificate
-----

#### Making request
```typescript
import * as moment from 'moment'
import {GetCertificateInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {GetCertificate} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA
};

const gc: GetCertificateInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/wsdl/CertificateService.xml',
  Timestamp: new moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  Command: 'GetCertificate',
  Service: 'ISSUER',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  TransferKey: '123123123123123123123',
  RequestId: '123456'
};

const certificate = await GetCertificate(gc);
console.log(certificate);
```

#### Expected response
This certificate is later used with `BANK_CERTIFICATE` variable.
```json5
{
  Name: 'SURNAME=<your-customer-id>, CN=<your-company-name>, O=<>, C=<country>',
  Certificate: 'base64-encoded-certificate',
  CertificateFormat: 'X509',
  ExpirationDateTime: '<certificate-expiration-date>'
}
```
Certificate should be renewed with Renew Certificate method before it's expired. 

You can see X509v3 certificate details after Base64 decoding response certificate and then
using OpenSSL to view it:
```shell script
openssl x509 -in certificate_file_name.extension -text
```


Renew certificate
-----

#### Making request
```typescript
import * as moment from 'moment';
import {GetCertificateInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {RenewCertificate} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here";
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA
};

const gc: GetCertificateInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/wsdl/CertificateService.xml',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  Command: 'RenewCertificate',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  RequestId: '123456',
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
};

const certificate = await RenewCertificate(gc);
console.log(certificate);
```

#### Expected response
```json5
{
  Name: 'SURNAME=<your-customer-id>, CN=<your-company-name>, O=<>, C=<country>',
  Certificate: 'base64-encoded-certificate',
  CertificateFormat: 'X509',
  ExpirationDateTime: '<certificate-expiration-date>'
}
```
Certificate should be renewed with Renew Certificate method before it's expired. 



Bank statement
-----
```typescript
import * as moment from 'moment';
import {XTInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {BankStatement} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here";
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA
};

const xt: XTInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: "FI",
};

const bankStatement = await BankStatement(xt);
console.log(bankStatement);
```


#### Expected response
In progress...
```json5
{
  
}
```


SEPA payment
-----
Instructions for populating all fields, see [ISO20022_maksut.pdf](./documents/ISO20022_maksut.pdf).
```typescript
import * as moment from 'moment';
import {XLInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {SEPAPayment} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here";
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA
};

const xl: XLInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: "FI",
  sepa: {
    CcyOfTrf: 'EUR',
    GrpHdr: {
      MsgId: 'MSGID000001',
      CreDtTm: moment().format('YYYY-MM-DDThh:mm:ssZ'),
      NbOfTxs: 1,
      InitgPty: {
        Nm: 'Origin Company',
        PstlAdr: {
          Ctry: 'FI',
          AdrLine: 'Test street 123',
          AdrLine2: 'FI-00100 Helsinki',
        },
        Id: {
          OrgId: {
            Othr: {
              Id: '1234567890',
              SchmeNm: {
                Cd: 'BANK',
              }
            }
          }
        }
      }
    },
    PmtInf: {
      PmtInfId: '20210815-12345678912',
      PmtMtd: 'TRF',
      PmtTpInf: {
        SvcLvl: {
          Cd: 'BANK',
        }
      },
      ReqdExctnDt: '2021-08-15',
      Dbtr: {
        Nm: 'Origin Company',
        PstlAdr: {
          Ctry: 'FI',
          AdrLine: 'Test street 123',
          AdrLine2: 'FI-00100 Helsinki',
        },
        Id: {
          OrgId: {
            Othr: {
              Id: '12345678912',
              SchmeNm: {
                Cd: 'BANK',
              }
            }
          }
        }
      },
      DbtrAcct: {
        Id: {
          IBAN: 'FI1234567891234567',
        }
      },
      DbtrAgt: {
        FinInstnId: {
          BIC: 'ITELFIHH',
        }
      },
      ChrgBr: 'SLEV',
      CdtTrfTxInf: {
        PmtId: {
          InstrId: 'InstrId000001',
          EndToEndId: 'EndToEndId000001',
        },
        PmtTpInf: {
          SvcLvl: {
            Cd: 'BANK',
          }
        },
        Amt: {
          InstdAmt: 500.00,
        },
        ChrgBr: 'SLEV',
        CdtrAgt: {
          FinInstnId: {
            BIC: 'ITELFIHH',
          }
        },
        Cdtr: {
          Nm: 'Testi Testinen',
          PstlAdr: {
            Ctry: 'FI',
            AdrLine: 'Test street 321',
            AdrLine2: 'FI-00200 Helsinki',
          },
          Id: {
            OrgId: {
              Othr: {
                Id: '12345678913',
                SchmeNm: {
                  Cd: 'BANK',
                }
              }
            }
          }
        },
        CdtrAcct: {
          Id: {
            IBAN: 'FI1234567891234568',
          }
        },
        RmtInf: {
          Ustrd: 'Sample invoice 123',
        }
      }
    }
  }
};

const sepaPayment = await SEPAPayment(xl);
console.log(sepaPayment);
```


#### Expected response
Is a object of FileDescriptor.
```json5
{
  FileReference: '530253',
  TargetId: 'NONE',
  FileType: 'XL',
  FileTimestamp: '2021-08-15T21:29:48.497+03:00',
  Status: 'WFP',
  AmountTotal: '500.0',
  TransactionCount: '1',
  Deletable: 'false'
}
```


SEPA errors
-----
Returns list of SEPA-XML errors | pain.002.001.02 or .03 related to payments.
```typescript
import * as moment from 'moment';
import {XPInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {SEPAErrors} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here";
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA
};
const xp: XPInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: "FI",
};
const sepaErrors = await SEPAErrors(xp);
console.log(sepaErrors);
```


#### Expected response
Todo...
```json5
{
  
}
```
