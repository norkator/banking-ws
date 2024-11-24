# Banking-ws

![lint-test-build-status](https://github.com/norkator/banking-ws/actions/workflows/lint-test-build.yml/badge.svg)
![publish-package-status](https://github.com/norkator/banking-ws/actions/workflows/publish-package.yml/badge.svg)

# ⚠️ Development and maintaining end notice

As of 24.11.2024, this repository will be in archived state and is no longer developed or maintained.

```shell script
npm install banking-ws
```

This is javascript library for financial messages using web services mainly targeted for Node.js

This library can:

* Create certificates for Samlink banking web service.
* It can construct and validate SOAP messages.
* Get and renew certificates.
* Make payment files and ask payment statuses which are represented as json.
* Request and parse bank statements and represented them as json.

Supported banks
-----

* Banks supported by Samlink.

Table of contents
=================

* [Resources](#resources)
  * [Links](#links)
  * [Documents](#documents)
* [Contributors](#contributors)
* [Before release](#before-release)
* [Installing](#installing)
* [Docker sample](#docker-sample)
* [Terminology](#terminology)
* [Getting Started](#getting-started)
* [Examples](#examples)
  * [Generate new certificate](#generate-new-certificate)
  * [Get certificate](#get-certificate)
  * [Renew certificate](#renew-certificate)
  * [Bank Statement](#bank-statement)
  * [SEPA Payments info validation](#sepa-payments-info-validation)
  * [SEPA Payments](#sepa-payments)
  * [Download File List](#download-file-list)
  * [Download File](#download-file)

Resources
============

Links
-----

* [http://xsd2xml.com/](http://xsd2xml.com/) is handy for converting `xsd` schemas to `xml` samples.
* [Sepa XML validation](https://www.mobilefish.com/services/sepa_xml_validation/sepa_xml_validation.php) is handy for
  validating SEPA `pain` messages.
* [Chilkat - xmlDsigVerify](https://tools.chilkat.io/xmlDsigVerify.cshtml) lifesaver with XML signature verification.
  The only tool which gave confidence.

Documents
-----

* https://samlink.fi/ohjelmistopalvelut/
* https://samlink.fi/app/uploads/2023/05/Palvelukuvaus_C2B_Pain_03.pdf
* https://www.mobilefish.com/services/sepa_xml_validation/sepa_xml_validation.php
* https://www.finanssiala.fi/wp-content/uploads/2021/03/WebServices_Messages_v110_20200504.pdf
* https://www.finanssiala.fi/en/topics/payment-services-in-finland/payment-technical-documents/
* https://www.finanssiala.fi/wp-content/uploads/2021/03/ISO20022_Payment_Guide.pdf
* https://samlink.fi/app/uploads/2023/05/XML-account_statement_camt.053.001.02.pdf

Contributors
============

Special thanks for contributing:

* [Maiska123](https://github.com/Maiska123)

Before release
============

1. Check that dependencies are up-to-date `->` latest.
2. `npm run test` and `npm run lint` gives no errors.
3. Increment library version from `package.json` file.

Installing
============

1. Mac and Linux already has OpenSSL pre-installed but with Windows you need to download binary somewhere
   like [here](https://slproweb.com/products/Win32OpenSSL.html).

* Then add its binary to your system path variable `;C:\Program Files\OpenSSL-Win64\bin`

2. Install npm package via:
    ```shell script
    npm install banking-ws
    ```
   or
    ```shell script
    yarn add banking-ws
    ```

3. In case of developing / testing this library make sure that global
   ts-node is at latest version
   ```shell script
   npm install -g ts-node@latest
   ```

Docker sample
============
Running as docker container could be done in following way:

```dockerfile
FROM node:18.14.2-alpine
RUN apk add openssl

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "node", "./src/payment-application.js"]
```

this sample assumes that you have payment application having `banking-ws` as dependency.
OpenSSL is added here since `banking-ws` requires its features to create keys.

Terminology
============

* `SAMLINK_TEST_ROOT_CA` is used with axios ca config at Samlink test side. Taken from Samlink documentation provided
  with customerId.
* `BANK_CERTIFICATE` is a base64 encoded certificate get after initial GetCertificate command and new ones after
  RenewCertificate.
* `CLIENT_CERTIFICATE` is signing certificate you have created with OpenSSL.
* `CLIENT_PRIVATE_KEY` is private key for upper signing certificate you created with OpenSSL

Getting started
============
You need certificates from your bank which is got with get certificate request. To make request you first need:

* Your own generated signing certificate (`CLIENT_CERTIFICATE`).
* Private key for your signing certificate (`CLIENT_PRIVATE_KEY`).

Then you need to get your bank to sign your signing/encryption certificate(s). For this you need to make

* Your signing certificate signing request

### Generating your own CSR

You can generate your certificate signing requests with `openssl`

```bash
openssl req -out signing.csr -new -newkey rsa:2048 -nodes -keyout signing.key
```

After this, you should have the following files:

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
✅ Production tested

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

You can decode `clientCertificate` and then its pem base64 and then see that your given parameters exists.


Get certificate
-----
✅ Production tested

#### Making request

```typescript
import * as moment from 'moment'
import {GetCertificateInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {GetCertificate} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const CLIENT_CERTIFICATE = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
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

You can see X509v3 certificate details after Base64 decoding response certificate and then using OpenSSL to view it:

```shell script
openssl x509 -in certificate_file_name.extension -text
```

Renew certificate
-----
⚠️ Staging environment tested

Note that renew request is made using current still active `BANK_CERTIFICATE` and your
old `CLIENT_PRIVATE_KEY`. From a new key pair you pass to this call only new `CLIENT_CERTIFICATE`.
You should use this [Generate new certificate](#generate-new-certificate) to make new ones.

I have named below variables in "new" and "old" ways which explains what to use and where.

#### Making request

```typescript
import * as moment from 'moment';
import {GetCertificateInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {RenewCertificate} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const BANK_CERTIFICATE_OLD = "base64-content-here";
const CLIENT_CERTIFICATE_NEW = "base64-content-here";
const CLIENT_PRIVATE_KEY_OLD = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
};

const gc: GetCertificateInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/wsdl/CertificateService.xml',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  Command: 'RenewCertificate',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE_NEW,
  Base64EncodedBankCsr: BANK_CERTIFICATE_OLD,
  RequestId: '123456',
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY_OLD,
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
✅ Production tested

Known as `camt.053.001.02`.

```typescript
import * as moment from 'moment';
import {XTInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {BankStatement} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
};

const xt: XTInterface = {
  userParams: userParams,
  verifyResponseSignature: true,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: 'FI',
};

const bankStatement = await BankStatement(xt);
console.log(bankStatement);
```

#### Expected response

Below is sample of retrieved bank statement details:

```json5
{
  FileReference: '1536794526',
  TargetId: 'NONE',
  UserFilename: 'STOL001.OLTCX60H.CAMT053.PS',
  FileType: 'XT',
  FileTimestamp: '2023-06-30T21:23:44.678+03:00',
  Status: 'NEW',
  ForwardedTimestamp: '2023-06-30T21:23:44.678+03:00',
  Deletable: 'false'
}
```

After bank statement response, use download file option to download bank statement file using `FileReference` retrieved
with this method.


SEPA payments info validation
-----
⚠️ Developed based on needs

Below is just a mock sample leading to invalid validation result.

```typescript
import {SEPAPaymentInformationInterface, XLPaymentInfoValidationInterface} from './interfaces';
import {SEPAPaymentInfoValidation} from './index';

const pmtInf: SEPAPaymentInformationInterface[] = [{
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
          Id: '12345678913',
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
      InstrId: 'InstrId000002',
      EndToEndId: 'EndToEndId000001',
    },
    PmtTpInf: {
      SvcLvl: {
        Cd: 'BANK',
      }
    },
    Amt: {
      InstdAmt: '425.60',
    },
    ChrgBr: 'SLEV',
    CdtrAgt: {
      FinInstnId: {
        BIC: 'ITELFIHH',
      }
    },
    Cdtr: {
      Nm: 'Hello World',
      PstlAdr: {
        Ctry: 'FI',
        AdrLine: 'Test street 321',
        AdrLine2: 'FI-00200 Helsinki',
      },
      Id: {
        OrgId: {
          Othr: {
            Id: '12345678914',
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
}];

const xlPmtInfo: XLPaymentInfoValidationInterface = {PmtInf: pmtInf}
const sepaPaymentValidation = await SEPAPaymentInfoValidation(xlPmtInfo);
console.log(sepaPaymentValidation);
```

#### Expected response

This example is invalid and errors contains list of issues

```json5
{
  PmtInf: [
    {
      valid: false,
      errors: [
        {
          code: 6,
          status: 'WrongAccountBankBranchChecksum'
        },
        {
          code: 5,
          status: 'WrongIBANChecksum'
        }
      ]
    }
  ]
}
```

SEPA payments
-----
✅ Production tested

Based on https://samlink.fi/app/uploads/2023/05/Palvelukuvaus_C2B_Pain_03.pdf
Where request is called `Pain001.001.03` and returned status response `Pain002.001.03`.

Given details are not validated. Use earlier SEPA payment validation method to
validate your payment details.

Current limitation for this library is that payment information C part =
`Credit Transfer Transaction Information` can hold only one transaction. This means that
`NbOfTxs` will be same as `PmtInf` array count.

```typescript
import * as moment from 'moment';
import {XLInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {SEPAPayment} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
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
  language: 'FI',
  sepa: {
    CcyOfTrf: 'EUR',
    GrpHdr: {
      MsgId: 'MSGID000001',
      CreDtTm: moment().format('YYYY-MM-DDThh:mm:ssZ'),
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
    PmtInf: [{
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
          InstdAmt: '500.00',
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
    }]
  },
  logResponse: false,
};

const sepaPayment = await SEPAPayment(xl);
console.log(sepaPayment);
```

#### Expected response

Is object of FileDescriptor.

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

#### Status terminology

```
WFP = Waiting for processing
WFC = Waiting for confirmation
FWD = Forwarded to processing
DLD = Downloaded
DEL = Deleted
NEW = New file
KIN = Key-in
```

Download file list
-----
✅ Production tested

Returns list of SEPA-XML descriptors. Known as `Pain002.001.03` related to earlier section payments.

Use `fileStatus` to filter what descriptors are looked for.

```typescript
import * as moment from 'moment';
import {XPInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {DownloadFileList} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
};
const xp: XPInterface = {
  userParams: userParams,
  verifyResponseSignature: true,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: 'FI',
  fileStatus: 'NEW',
};
const xpFileList = await DownloadFileList(xp);
console.log(xpFileList);
```

#### Expected response

Following array sample is example when you have two SEPA payments sent to bank system.

```json5
[
  {
    FileReference: '530259',
    TargetId: 'NONE',
    UserFilename: 'NONE.palaute',
    ParentFileReference: '530258',
    FileType: 'XP',
    FileTimestamp: '2021-08-17T20:47:39.775+03:00',
    Status: 'NEW',
    ForwardedTimestamp: '2021-08-17T20:47:39.775+03:00',
    Deletable: 'false'
  },
  {
    FileReference: '530254',
    TargetId: 'NONE',
    UserFilename: 'NONE.palaute',
    ParentFileReference: '530253',
    FileType: 'XP',
    FileTimestamp: '2021-08-15T21:29:48.349+03:00',
    Status: 'NEW',
    ForwardedTimestamp: '2021-08-15T21:29:48.349+03:00',
    Deletable: 'false'
  }
]
```

Return is always an array. Either empty or populated like in sample.

* `ParentFileReference` is our side SEPA message used reference.

Download file
-----
✅ Production tested

Allows downloading files using file reference id. Response parsed content is based on used file type. Supported file
types are:

`XP` = retrieval of sepa payment status for pain.002.001.02 ja .03  
`XT` = retrieval of bank statement for camt.053.001.02

```typescript
import * as moment from 'moment';
import {DFInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {DownloadFile} from './src/index';

const SAMLINK_TEST_ROOT_CA = "base64-content-here"; // in production use value: null
const BANK_CERTIFICATE = "base64-content-here";
const CLIENT_CERTIFICATE = "base64-content-here";
const CLIENT_PRIVATE_KEY = "base64-content-here";

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  Base64EncodedRootCA: SAMLINK_TEST_ROOT_CA,
  rejectUnauthorized: true,
};
const df: DFInterface = {
  userParams: userParams,
  verifyResponseSignature: true,
  requestUrl: 'https://185.251.49.57/services/CorporateFileService',
  RequestId: '123456',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.10.0'} as SoftwareIdInterface,
  ExecutionSerial: '123456',
  Base64EncodedClientCsr: CLIENT_CERTIFICATE,
  Base64EncodedBankCsr: BANK_CERTIFICATE,
  Base64EncodedClientPrivateKey: CLIENT_PRIVATE_KEY,
  language: 'FI',
  fileType: 'XP',
  fileReferences: ['553481']
};

const fileDescriptors = await DownloadFile(df);
console.log(fileDescriptors);
```

#### Expected response

Following is a sample response for requested `XP` file reference:

```json5
{
  "FileReference": "553481",
  "TargetId": "NONE",
  "UserFilename": "NONE.palaute",
  "ParentFileReference": "553480",
  "FileType": "XP",
  "FileTimestamp": "2023-03-09T18:59:10.193+02:00",
  "Status": "DLD",
  "ForwardedTimestamp": "2023-03-09T18:59:10.193+02:00",
  "Deletable": "false",
  "PaymentStatusReport": {
    "CreateDateTime": "2023-03-09T16:59:10.183Z",
    "MessageIdentifier": "01871490_1678381150183",
    "OriginalMessageIdentification": "MSGID202303",
    "OriginalPaymentInformationIdentification": "pain.001.001.02",
    "Status": {
      "GroupStatus": "ACTC",
      "TransactionStatus": "-",
      "StatusReasonInformationDescriptions": [
        "No Description."
      ],
      "StatusReasonInformationCode": "-",
      "AdditionalInformation": "-"
    }
  },
  "BankStatement": null,
}
```

Sample response for bank stement `XT` file reference:

TODO

```json5
{
}
```
