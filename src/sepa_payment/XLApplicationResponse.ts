'use strict';

import {parseString} from 'xml2js';
import {XLInterface} from '../interfaces';

class XLApplicationResponse {

  private readonly response: string;
  private readonly xl: XLInterface;

  constructor(xl: XLInterface, response: string) {
    this.xl = xl;
    this.response = response;
  }

  public async parseBody(): Promise<string> {
    // parse, handle application response envelope
    const envelopeXML: any = await this.parseXml(this.response);
    // Todo....
    return this.response;
  }


  private async parseXml(xmlString: string) {
    return await new Promise((resolve, reject) => parseString(xmlString, (err, jsonData) => {
      if (err) {
        reject(err);
      }
      resolve(jsonData);
    }));
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Since only '0' is successful, will throw error with every other and use its own response text
   * @param rc
   * @param responseText
   */
  private handleResponseCode(rc: string, responseText: string): void {
    if (rc === '5' || rc === '6' || rc === '7' || rc === '8' || rc === '12' || rc === '26' || rc === '30') {
      throw new Error(responseText);
    }
  }

}

export {
  XLApplicationResponse
};
