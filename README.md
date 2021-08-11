# Banking-ws

<b>Work in progress for long time!</b>

Library to construct, validate and make corporate banking web service request with SOAP.

Works only with Samlink.


Table of contents
=================
* [Resources](#resources)
    * [Links](#links)
    * [Documents](#documents)
* [Installing](#installing)
* [Getting Started](#getting-started)
* [Examples](#examples)
    * [Get certificate](#get-certificate)
    * [Renew certificate](#renew-certificate)
    * [Bank Statement](#bank-statement)
    * [SEPA Payment](#sepa-payment)
    


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

```shell script
todo...
```



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
signing.csr
signing.key
```

### Getting test credentials and firewall rule
* You cannot use this without Samlink opening firewall rule to allow you making request behind your public ip.
* You need to ask Samlink for customer id and one time use transfer key.



Examples
============
Below are examples for each step.


Get certificate
-----

#### Making request
```typescript
import * as moment from 'moment'
import {GetCertificateInterface, SoftwareIdInterface, UserParamsInterface} from './src/interfaces';
import {GetCertificate} from './src/index';
import * as path from 'path';


const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  rootCAPath: path.join(__dirname + '/../' + 'keys/samlink_test_root_ca.csr')
};

const gc: GetCertificateInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/wsdl/CertificateService.xml',
  Timestamp: new moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  Command: 'GetCertificate',
  Service: 'ISSUER',
  CsrPath: path.join(__dirname + '/../' + '/keys/signing.csr'),
  TransferKey: '123123123123123123123',
  RequestId: '123456'
};

const certificate = await GetCertificate(gc);
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
import * as path from 'path';

const userParams: UserParamsInterface = {
  bank: 'Samlink',
  environment: 'PRODUCTION',
  customerId: '12345678',
  rootCAPath: path.join(__dirname + '/../' + 'keys/samlink_test_root_ca.csr')
};

const gc: GetCertificateInterface = {
  userParams: userParams,
  requestUrl: 'https://185.251.49.57/wsdl/CertificateService.xml',
  Timestamp: moment().format('YYYY-MM-DDThh:mm:ssZ'),
  SoftwareId: {name: 'TEST', version: '0.9.0'} as SoftwareIdInterface,
  Command: 'RenewCertificate',
  CsrPath: path.join(__dirname + '/../' + '/keys/signing.csr'),
  RequestId: '123456',
  Base64EncodedClientPrivateKey: "eW91cnByaXZhdGVrZXloZXJlLWRpZC15b3UtdGhpbmstaS1jb21taXR0ZWQtbWluZS1vbi1naXRodWI/",
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
```



SEPA payment
-----
```typescript
```
