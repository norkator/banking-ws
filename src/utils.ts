import {createHash} from 'crypto';
import {Bank, Environment, OutputEncoding, WsdlType} from './constants';
import * as path from 'path';
import {readFileSync} from 'fs';
// @ts-ignore
import * as openssl from 'openssl-nodejs';


/**
 * @param fullPath, path and filenames with extension
 * @constructor
 */
function LoadFileAsString(fullPath: string): string {
  const file = readFileSync(fullPath, 'utf-8');
  return Buffer.from(file).toString('utf-8');
}

/**
 * @return {string} wsdl file path and name
 */
function GetWSDL(environment: Environment, bank: Bank, type: WsdlType): string {
  const path_ = path.join(__dirname + '/wsdl/wsdl_' + bank.toLowerCase() + '_' + type + environment.toLowerCase() + '.xml');
  console.log(path_);
  return path_;
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
    // .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '') // remove white spaces
    .replace(/\s+/, '') // remove white spaces
    // .replace('\n', '')
}

/**
 * @param content, example base64 encoded message with white spaces
 * @constructor
 */
function RemoveWhiteSpacesAndNewLines(content: string): string {
  return content.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '') // remove white spaces
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
    }], function () {
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

function OpenSSLVerifySHA1Signature(pemKey: string, fileContent: string): Promise<string> {
  return new Promise((resolve, reject) => {
    openssl(['dgst', '-sha1', '-verify', {
      name: 'public.pem',
      buffer: Buffer.from(pemKey)
    }, '-signature', {
      name: 'sha1.sign',
      buffer: Buffer.from(fileContent)
    }], function (result) {
      console.log(result.toString());
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
  LoadFileAsString,
  GetWSDL,
  Base64DecodeStr,
  Base64EncodeStr,
  LoadFileFromPath,
  FormatCertificate,
  RemoveWhiteSpacesAndNewLines,
  Base64EncodedSHA1Digest,
  OpenSSLGetSHA1Signature,
  OpenSSLVerifySHA1Signature,
}
