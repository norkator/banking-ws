'use strict';

import * as xmlBuilder from 'xmlbuilder'
import * as moment from 'moment'
import {SignedXml} from "xml-crypto";
import {Base64DecodeStr} from "../utils";
import {GetCertificateInterface} from "../interfaces";

class CertRenewRequestEnvelope {

  private gc: GetCertificateInterface;
  private readonly senderId: string;
  private readonly requestId: string;
  private readonly applicationRequest: string;

  constructor(gc: GetCertificateInterface, applicationRequest: string) {
    this.gc = gc;
    this.applicationRequest = applicationRequest;
  }

  public createXmlBody(): string {
    const envelopeObject = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:opc': 'http://mlp.op.fi/OPCertificateService',
        'soapenv:Header': {

          'wsse:Security': {
            '@xmlns:wsse': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
            '@xmlns:wsu': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
            '@soapenv:mustUnderstand': '1',


            'wsse:BinarySecurityToken': {
              '@EncodingType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
              '@ValueType': 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3',
              '@wsu:Id': this.getWsuId(),
              '#text': this.getBinarySecurityToken(),
            },

            'wsu:Timestamp': {
              '@wsu:Id': '',
              'wsu:Created': '',
              'wsu:Expires': '',
            }
          }

        },
        'soapenv:Body': {
          'opc:getCertificatein': {
            'opc:RequestHeader': {
              'opc:SenderId': this.gc.userParams.customerId,
              'opc:RequestId': this.gc.RequestId,
              // @ts-ignore
              'opc:Timestamp': new moment().format('YYYY-MM-DDThh:mm:ssZ')
            },
            'opc:ApplicationRequest': this.applicationRequest,
          },
        },
      }
    };

    let xml_: xmlBuilder.XMLElement = xmlBuilder.create(envelopeObject);
    const xml = xml_.end({pretty: true});

    console.log(xml)

    const signingKey = Base64DecodeStr(this.gc.Base64EncodedClientPrivateKey);

    const sig = new SignedXml();
    sig.addReference("//*[local-name(.)='soapenv:Envelope']");
    sig.signingKey = signingKey;
    // sig.keyInfoProvider = new MyKeyInfo(signingKey);
    sig.computeSignature(xml);


    const signedXml = sig.getSignedXml();
    console.log(signedXml);
    process.exit(0);
    return signedXml;
  }

  private getWsuId(): string {
    return '';
  }

  private getBinarySecurityToken(): string {
    return '';
  }

}

export {
  CertRenewRequestEnvelope
};
