# Banking-ws

Library to construct, validate and make corporate banking web service request with SOAP.

Works with Samlink.


Table of contents
=================
* [Resources](#resources)
    * [Links](#links)
    * [Documents](#documents)
* [Installing](#installing)
* [Getting Started](#getting-started)
* [Examples](#examples)
    * [Get certificate](#get-certificate)
    


Resources
============

Links
-----
* [http://xsd2xml.com/](http://xsd2xml.com/) is handy for converting `xsd` schemas to `xml` samples.  
* [Sepa XML validation](https://www.mobilefish.com/services/sepa_xml_validation/sepa_xml_validation.php) is handy for validating SEPA `pain` messages.

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



Examples
============


Get certificate
-----
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
  // @ts-ignore
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


Renew certificate
-----
