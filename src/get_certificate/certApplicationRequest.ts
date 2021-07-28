'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {GetCertificateInterface} from '../interfaces';
import {Base64EncodeStr, LoadFileFromPath} from '../utils';


class CertApplicationRequest {

  private gc: GetCertificateInterface;

  constructor(gc: GetCertificateInterface) {
    this.gc = gc;
  }

  public async createXmlBody(): Promise<string | undefined> {
    try {
      const csr = await LoadFileFromPath(this.gc.CsrPath, 'utf-8');
      const certRequestObj = {
        'CertApplicationRequest': {
          '@xmlns': 'http://op.fi/mlp/xmldata/',
          '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
          '@xsi:schemaLocation': 'http://op.fi/mlp/xmldata/ file:////csamnt1/K830186$/Datapower/schemas/CertApplicationRequest_20090422.xsd',
          'CustomerId': this.gc.userParams.customerId,
          'Timestamp': this.gc.Timestamp, // 2012-12-13T12:12:12
          'Environment': this.gc.userParams.environment,
          'SoftwareId': this.getSoftwareId(),
          'Command': this.gc.Command,
          'Service': this.gc.Service,
          'Content': Base64EncodeStr(csr), // Base64 encoded -----BEGIN CERTIFICATE REQUEST----- ...
          'TransferKey': this.gc.TransferKey === undefined ? '' : this.gc.TransferKey,
        }
      };
      let xml: xmlBuilder.XMLElement = xmlBuilder.create(certRequestObj);
      return xml.end({pretty: true});
    } catch (e) {
      return undefined;
    }
  }

  private getSoftwareId(): string {
    return this.gc.SoftwareId.name + '-' + this.gc.SoftwareId.version;
  }

}

export {
  CertApplicationRequest
};
