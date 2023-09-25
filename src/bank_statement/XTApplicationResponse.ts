'use strict';

import {Base64DecodeStr, HandleResponseCode, ParseXml, RemoveWhiteSpacesAndNewLines} from '../utils/utils';
import {XTFileDescriptor, XTInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';

class XTApplicationResponse {

  private readonly response: string;
  private readonly xt: XTInterface;

  constructor(xt: XTInterface, response: string) {
    this.xt = xt;
    this.response = response;
  }

  public async parseBody(): Promise<XTFileDescriptor> {
    // parse, handle application response envelope
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await ParseXml(this.response);

    if (this.xt.verifyResponseSignature) {
      const envelopeSignature = new EnvelopeSignature();
      const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
      if (!envelopeValid) {
        throw {
          RequestId: this.xt.RequestId,
          Timestamp: this.xt.Timestamp,
          SoftwareId: this.xt.SoftwareId,
          error: new Error('XT response envelope did not pass signature verification')
        };
      }
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];

    const getDownloadFileListOut = body[0]['cor:downloadFileListout'];

    const encodedApplicationResponse = getDownloadFileListOut[0]['mod:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    if (this.xt.verifyResponseSignature) {
      const signature = new ApplicationRequestSignature();
      const validResponse = await signature.validateSignature(applicationResponseXML);
      if (!validResponse) {
        throw {
          RequestId: this.xt.RequestId,
          Timestamp: this.xt.Timestamp,
          SoftwareId: this.xt.SoftwareId,
          error: new Error('XT application response did not pass signature verification')
        };
      }
    }

    // parse, handle response itself
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const xml: any = await ParseXml(applicationResponseXML);
    const applicationResponse = xml['ApplicationResponse'];

    const ResponseCode = applicationResponse['ResponseCode'][0];
    const ResponseText = applicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    if (applicationResponse['FileDescriptors'] !== undefined) {
      const fd = applicationResponse['FileDescriptors'][0]['FileDescriptor'][0];

      return {
        FileReference: fd['FileReference'][0],
        TargetId: fd['TargetId'][0],
        UserFilename: fd['UserFilename'][0],
        FileType: fd['FileType'][0],
        FileTimestamp: fd['FileTimestamp'][0],
        Status: fd['Status'][0],
        ForwardedTimestamp: fd['ForwardedTimestamp'][0],
        Deletable: fd['Deletable'][0],
      } as XTFileDescriptor;
    } else {

      throw new Error("Bank statement request didn't return any content");
    }
  }


}

export {
  XTApplicationResponse
};
