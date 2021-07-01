import {createHash} from 'crypto';
import {Bank, Environment, OutputEncoding} from './constants';
import * as path from 'path';
import {readFileSync} from 'fs';
import * as openssl from 'openssl-nodejs';


/**
 * @return {string} wsdl file path and name
 */
function GetWSDL(environment: Environment, bank: Bank): string {
  return path.join(__dirname + '/wsdl/wsdl_' + bank.toLowerCase() + '_' + environment.toLowerCase() + '.xml');
}

/**
 * @param b64string
 * @constructor
 */
function Base64DecodeStr(b64string: string): string {
  return Buffer.from(b64string, 'base64').toString('utf-8');
}

/**
 * @param str
 * @return base64 string
 * @constructor
 */
function Base64EncodeStr(str: string): string {
  return Buffer.from(str).toString('base64');
}

/**
 * @param filePath, full path + filename and it's extension
 * @param outputEncoding
 * @constructor
 */
async function LoadFileFromPath(filePath: string, outputEncoding: OutputEncoding): Promise<string> {
  const file = readFileSync(filePath, outputEncoding);
  return Buffer.from(file).toString('utf-8');
}

/**
 * @param csr, without modifications
 * @example
 * -----BEGIN CERTIFICATE REQUEST-----
 * MIIC5DCCAcaCAQAwgZ4xCzAJBgNVBAYTAkZJMRIwEAYDVwhIdAlQaXErYW5tYWEx
 * EDAOBgNVBAcMB1RhbXBlciUxFTATBgNVBAoMDEZpbmFuc2VsbCcPeTEVMBMGA1UE
 * .....
 * -----END CERTIFICATE REQUEST-----
 * @constructor
 */
function FormatCertificate(csr: string): string {
  return csr
    .replace('-----BEGIN CERTIFICATE REQUEST-----', '')
    .replace('-----END CERTIFICATE REQUEST-----', '')
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '') // remove white spaces
}

/**
 * @param content to digest
 * @return base64 encoded sha1 digest
 * @constructor
 */
function Base64EncodedSHA1Digest(content: string): string {
  const shaSum = createHash('sha1');
  shaSum.update(content);
  return Base64EncodeStr(shaSum.digest('hex'));
}


function OpenSSLGetSHA1Signature(outFileName: string, privateKeyPem: string, xmlContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // openssl dgst -sha1 -sign ./keys/signing.key -out sha1.sign cert_debug.xml
    openssl(['dgst', '-sha1', '-sign', {
      name: 'signing.key',
      buffer: Buffer.from(privateKeyPem)
    }, '-out', outFileName, {
      name: 'toSign.xml',
      buffer: Buffer.from(xmlContent)
    }], function (err, buffer) {
      LoadFileFromPath(
        path.join(__dirname + '/../' + '/openssl/' + outFileName), 'base64'
      ).then((content) => {
        resolve(content);
      }).catch((error) => {
        reject(error);
      });
    });
  });
}

function OpenSSLGetCertificateModulus() {
  // Todo: openssl req -noout -modulus -in ./keys/signing.csr | openssl base64
}

function OpenSSLGetCertificateSubject() {
  // Todo: openssl req -noout -subject -in ./keys/signing.csr
}


export {
  GetWSDL,
  Base64DecodeStr,
  Base64EncodeStr,
  LoadFileFromPath,
  FormatCertificate,
  Base64EncodedSHA1Digest,
  OpenSSLGetSHA1Signature,
}
