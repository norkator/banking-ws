'use strict';

import {Base64DecodeStr, HandleResponseCode, ParseXml, RemoveWhiteSpacesAndNewLines} from '../utils/utils';
import {DFFileDescriptor, DFInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';
import {ParseContentFromPaymentStatusReport, ParsePaymentStatusReport} from '../utils/parsers';

class DFApplicationResponse {

  private readonly df: DFInterface;
  private readonly response: string;

  constructor(df: DFInterface, response: string) {
    this.df = df;
    this.response = response;
  }

  public async parseBody(): Promise<DFFileDescriptor> {
    // parse, handle application response envelope
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await ParseXml(this.response);

    const envelopeSignature = new EnvelopeSignature();
    const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
    if (!envelopeValid) {
      throw {
        RequestId: this.df.RequestId,
        Timestamp: this.df.Timestamp,
        SoftwareId: this.df.SoftwareId,
        error: new Error('DF response envelope did not pass signature verification')
      };
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];

    const getDownloadFileOut = body[0]['cor:downloadFileout'];

    const encodedApplicationResponse = getDownloadFileOut[0]['mod:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    const signature = new ApplicationRequestSignature();
    const validResponse = await signature.validateSignature(applicationResponseXML);
    if (!validResponse) {
      throw {
        RequestId: this.df.RequestId,
        Timestamp: this.df.Timestamp,
        SoftwareId: this.df.SoftwareId,
        error: new Error('DF application response did not pass signature verification')
      };
    }

    // parse, handle response itself
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const xml: any = await ParseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['ApplicationResponse'];

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    const Content = ns2CertApplicationResponse['Content'][0];
    const ParsedContent = await ParseContentFromPaymentStatusReport(Content);
    const PaymentStatusReport = await ParsePaymentStatusReport(JSON.parse(ParsedContent));
    const fd = ns2CertApplicationResponse['FileDescriptors'][0]['FileDescriptor'][0];

    return {
      FileReference: fd['FileReference'][0],
      TargetId: fd['TargetId'][0],
      UserFilename: fd['UserFilename'][0],
      ParentFileReference: fd['ParentFileReference'][0],
      FileType: fd['FileType'][0],
      FileTimestamp: fd['FileTimestamp'][0],
      Status: fd['Status'][0],
      ForwardedTimestamp: fd['ForwardedTimestamp'][0],
      Deletable: fd['Deletable'][0],
      Content: PaymentStatusReport,
    } as DFFileDescriptor;
  }

}

export {
  DFApplicationResponse
};
