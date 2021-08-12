'use strict';

import {CreateCertificateInterface, CreatedCertificateInterface} from '../interfaces';
import {Buffer} from 'buffer';
// @ts-ignore
import * as openssl from 'openssl-nodejs';
import {Base64EncodeStr, LoadFileAsString} from "../utils";
import * as path from "path";


class CreateCertificate {

  private cc: CreateCertificateInterface;
  private readonly CSR_NAME = 'signing.csr';
  private readonly PRIVATE_KEY_NAME = 'signing.key';

  constructor(cc: CreateCertificateInterface) {
    this.cc = cc;
  }

  public async createCertificate(): Promise<CreatedCertificateInterface> {
    await this.create();
    const csr = LoadFileAsString(path.join(__dirname + '/../../openssl/' + this.CSR_NAME));
    const privateKey = LoadFileAsString(path.join(__dirname + '/../../openssl/' + this.PRIVATE_KEY_NAME));
    return {
      clientCertificate: Base64EncodeStr(csr),
      clientPrivateKey: Base64EncodeStr(privateKey)
    } as CreatedCertificateInterface;
  }

  private async create() {
    return new Promise((resolve, reject) => {
      try {
        openssl([
          // see https://www.switch.ch/pki/manage/request/csr-openssl/
          'req', '-config', {
            name: 'csr.conf',
            buffer: Buffer.from(this.getConfiguration(), 'utf-8')
          }, '-out', this.CSR_NAME, '-new', '-newkey', 'rsa:2048',
          '-nodes', '-keyout', this.PRIVATE_KEY_NAME,
        ], function (err: string, buffer: any) {
          console.log(err.toString(), buffer.toString());
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private getConfiguration(): string {
    return `
FQDN = foo.example.org
ORGNAME = Example University
ALTNAMES = DNS:$FQDN   # , DNS:bar.example.org , DNS:www.foo.example.org
[ req ]
default_bits = 2048
default_md = sha256
prompt = no
encrypt_key = no
distinguished_name = dn
req_extensions = req_ext
[ dn ]
C = CH
O = $ORGNAME
CN = $FQDN
[ req_ext ]
subjectAltName = $ALTNAMES
`;
  }


}

export {
  CreateCertificate
};
