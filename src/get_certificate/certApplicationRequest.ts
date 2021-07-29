'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {GetCertificateInterface} from '../interfaces';
import {Base64DecodeStr, Base64EncodeStr, LoadFileFromPath} from '../utils';
import {SignedXml} from 'xml-crypto';


class CertApplicationRequest {

  private gc: GetCertificateInterface;

  constructor(gc: GetCertificateInterface) {
    this.gc = gc;
  }

  public async createXmlBody(): Promise<string | undefined> {
    const csr = await LoadFileFromPath(this.gc.CsrPath, 'utf-8');
    let certRequestObj: any = {
      'CertApplicationRequest': {
        '@xmlns': 'http://op.fi/mlp/xmldata/',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'http://op.fi/mlp/xmldata/ file:////csamnt1/K830186$/Datapower/schemas/CertApplicationRequest_20090422.xsd',
        'CustomerId': this.gc.userParams.customerId,
        'Timestamp': this.gc.Timestamp, // 2012-12-13T12:12:12
        'Environment': this.gc.userParams.environment,
        'SoftwareId': this.getSoftwareId(),
        'Command': this.gc.Command,
        'Service': 'ISSUER',
        'Content': Base64EncodeStr(csr), // Base64 encoded -----BEGIN CERTIFICATE REQUEST----- ...
      }
    };
    if (this.gc.Command === 'GetCertificate') {
      if (this.gc.TransferKey === undefined) {
        throw new Error('TransferKey cannot be undefined')
      }
      certRequestObj.CertApplicationRequest['TransferKey'] = this.gc.TransferKey;

      let xml: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      return xml.end({pretty: true});
    }

    if (this.gc.Command === 'RenewCertificate') {
      if (this.gc.Base64EncodedClientPrivateKey === undefined) {
        throw new Error('Base64EncodedClientPrivateKey cannot be undefined with RenewCertificate command')
      }
      const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);

      let xml_: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      const xml = xml_.end({pretty: true});

      const sig = new SignedXml();
      sig.addReference("//*[local-name(.)='CertApplicationRequest']");
      sig.signingKey = signingKey;
      // sig.keyInfoProvider = new MyKeyInfo(signingKey);
      sig.computeSignature(xml);

      // console.log(sig.getSignedXml());
      // process.exit(0);

      return sig.getSignedXml();
    }

    return undefined;
  }

  private getSoftwareId(): string {
    return this.gc.SoftwareId.name + '-' + this.gc.SoftwareId.version;
  }

}

export {
  CertApplicationRequest
};
