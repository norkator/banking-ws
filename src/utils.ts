import {createHash} from 'crypto';
import {Bank, Environment, OutputEncoding, WsdlType} from './constants';
import * as path from 'path';
import {readFileSync} from 'fs';


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
    .replace('-----BEGIN CERTIFICATE REQUEST-----', '-----BEGIN CERTIFICATE-----')
    .replace('-----END CERTIFICATE REQUEST-----', '-----END CERTIFICATE-----')
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '') // remove white spaces
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


export {
  LoadFileAsString,
  GetWSDL,
  Base64DecodeStr,
  Base64EncodeStr,
  LoadFileFromPath,
  FormatCertificate,
  RemoveWhiteSpacesAndNewLines,
  Base64EncodedSHA1Digest,
}
