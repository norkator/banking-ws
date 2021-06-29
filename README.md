# Banking-ws

Library to construct, validate and make corporate banking web service request with SOAP



Table of contents
=================
* [Resources](#resources)
    * [Links](#links)
    * [Documents](#documents)
* [Installing](#installing)
* [Getting Started](#getting-started)
    


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
openssl req -out encryption.csr -new -newkey rsa:2048 -nodes -keyout encryption.key
openssl req -out signing.csr -new -newkey rsa:2048 -nodes -keyout signing.key
```

After all this, you should have folllowing files:

```
encryption.csr
encryption.key
signing.csr
signing.key
```
