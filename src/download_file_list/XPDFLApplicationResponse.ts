'use strict';

import {Base64DecodeStr, HandleResponseCode, ParseXml, RemoveWhiteSpacesAndNewLines} from '../utils/utils';
import {XPFileDescriptor, XPInterface} from '../interfaces';
import {EnvelopeSignature} from '../envelopeSignature';
import {ApplicationRequestSignature} from '../signature';

class XPDFLApplicationResponse {

  private readonly xp: XPInterface;
  private readonly response: string;

  constructor(xp: XPInterface, response: string) {
    this.xp = xp;
    this.response = response;
  }

  public async parseBody(): Promise<XPFileDescriptor[]> {
    // parse, handle application response envelope
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const envelopeXML: any = await ParseXml(this.response);

    if (this.xp.verifyResponseSignature) {
      const envelopeSignature = new EnvelopeSignature();
      const envelopeValid = await envelopeSignature.validateEnvelopeSignature(this.response);
      if (!envelopeValid) {
        throw {
          RequestId: this.xp.RequestId,
          Timestamp: this.xp.Timestamp,
          SoftwareId: this.xp.SoftwareId,
          error: new Error('XP response envelope did not pass signature verification')
        };
      }
    }

    const envelope = envelopeXML['soapenv:Envelope'];
    const body = envelope['soapenv:Body'];

    const getDownloadFileListOut = body[0]['cor:downloadFileListout'];

    const encodedApplicationResponse = getDownloadFileListOut[0]['mod:ApplicationResponse'][0];
    const cleanedApplicationResponse = RemoveWhiteSpacesAndNewLines(encodedApplicationResponse);
    const applicationResponseXML = Base64DecodeStr(cleanedApplicationResponse);

    if (this.xp.verifyResponseSignature) {
      const signature = new ApplicationRequestSignature();
      const validResponse = await signature.validateSignature(applicationResponseXML);
      if (!validResponse) {
        throw {
          RequestId: this.xp.RequestId,
          Timestamp: this.xp.Timestamp,
          SoftwareId: this.xp.SoftwareId,
          error: new Error('XP application response did not pass signature verification')
        };
      }
    }

    // parse, handle response itself
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const xml: any = await ParseXml(applicationResponseXML);
    const ns2CertApplicationResponse = xml['ApplicationResponse'];

    const ResponseCode = ns2CertApplicationResponse['ResponseCode'][0];
    const ResponseText = ns2CertApplicationResponse['ResponseText'][0];
    HandleResponseCode(ResponseCode, ResponseText);

    const fds = ns2CertApplicationResponse['FileDescriptors'][0]['FileDescriptor'];
    const fileDescriptors: XPFileDescriptor[] = [];
    fds.forEach((fd: XPFileDescriptor) => {
      fileDescriptors.push({
        FileReference: fd['FileReference'][0],
        TargetId: fd['TargetId'][0],
        UserFilename: fd['UserFilename'][0],
        ParentFileReference: getParentFileReference(fd),
        FileType: fd['FileType'][0],
        FileTimestamp: fd['FileTimestamp'][0],
        Status: fd['Status'][0],
        ForwardedTimestamp: fd['ForwardedTimestamp'][0],
        Deletable: fd['Deletable'][0],
      });
    });

    function getParentFileReference(fd: XPFileDescriptor): string | null {
      if (fd['ParentFileReference'] === null) {
        return null;
      }

      return fd['ParentFileReference'] !== undefined ? fd['ParentFileReference'][0] : null
    }

    return fileDescriptors;
  }

}

export {
  XPDFLApplicationResponse
};
