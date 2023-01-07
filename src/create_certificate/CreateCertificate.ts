'use strict';

import {CreateCertificateInterface, CreatedCertificateInterface} from '../interfaces';
import {Buffer} from 'buffer';

const openssl = require('openssl-nodejs');
import {Base64EncodeStr, LoadFileAsString} from '../utils/utils';
import * as path from 'path';


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

  public async checkCertificate(): Promise<string | null> {
    return await this.check();
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
        ], function (err: string, buffer: Buffer) {
          console.log(err.toString(), buffer.toString());
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private async check(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const csr = LoadFileAsString(path.join(__dirname + '/../../openssl/' + this.CSR_NAME));
      try {
        openssl([
          'req', '-text', '-noout', '-verify', '-in', {
            name: 'signing.csr',
            buffer: Buffer.from(csr, 'utf-8')
          },
        ], function (err: string, buffer: Buffer) {
          resolve(buffer.toString());
        });
      } catch (e) {
        reject(null);
      }
    });
  }

  private getConfiguration(): string {
    return `
[ ca ]
default_ca = CA_default

[ req ]
default_bits = 2048
default_md = sha256
prompt = no
encrypt_key = no
distinguished_name = req_distinguished_name

[ req_distinguished_name ]
countryName = ` + this.cc.twoLetterCountryCode + `
stateOrProvinceName = ` + this.cc.stateOrProvince + `
localityName = ` + this.cc.city + `
organizationName = ` + this.cc.companyName + `
organizationalUnitName = ` + this.cc.companyUnitName + `
commonName = ` + this.cc.customerId + `
emailAddress = ` + this.cc.emailAddress + `

[ policy_match ]
countryName = ` + this.cc.twoLetterCountryCode + `
stateOrProvinceName = ` + this.cc.stateOrProvince + `
localityName = ` + this.cc.city + `
organizationName = ` + this.cc.companyName + `
organizationalUnitName = ` + this.cc.companyUnitName + `
commonName = ` + this.cc.customerId + `
emailAddress = ` + this.cc.emailAddress + `
`;
  }

}


export {
  CreateCertificate,
};
