'use strict';

class CertApplicationResponse {

  private readonly response: string;

  constructor(response: string) {
    this.response = response;
    this.parseBody();
  }

  private parseBody(): void {
  }

  public isValid(): boolean {
    return false;
  }

  public getCertificate(): string | undefined {
    return undefined;
  }

}

export {
  CertApplicationResponse
};
