'use strict';

import {parseString} from 'xml2js';

class CertApplicationResponse {

  private readonly response: string;

  constructor(response: string) {
    this.response = response;
  }

  public async parseBody(): Promise<void> {
    const xml = await this.parseXml(this.response);

    console.log(xml);
  }

  public isValid(): boolean {
    return false;
  }

  public getCertificate(): string | undefined {
    return undefined;
  }


  private async parseXml(xmlString: string) {
    return await new Promise((resolve, reject) => parseString(xmlString, (err, jsonData) => {
      if (err) {
        reject(err);
      }
      resolve(jsonData);
    }));
  }

}

export {
  CertApplicationResponse
};
