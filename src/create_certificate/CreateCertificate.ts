'use strict';

import {CreateCertificateInterface, CreatedCertificateInterface} from '../interfaces';
import {Buffer} from 'buffer';


class CreateCertificate {

  private cc: CreateCertificateInterface;

  constructor(cc: CreateCertificateInterface) {
    this.cc = cc;
  }

  public async createCertificate(): Promise<CreatedCertificateInterface> {
    return new Promise((resolve, reject) => {
      try {
        const config = `
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
        openssl([
          // see https://www.switch.ch/pki/manage/request/csr-openssl/
          'req', '-config', {
            name: 'csr.conf',
            buffer: Buffer.from(config, 'utf-8')
          }, '-out', 'signing.csr', '-new', '-newkey', 'rsa:2048',
          '-nodes', '-keyout', 'signing.key',
        ], function (err: string, buffer: any) {
          console.log(err.toString(), buffer.toString());
          resolve('');
        });
      } catch (e) {
        return undefined;
      }
    });
    return '';
  }


}

export {
  CreateCertificate
};
