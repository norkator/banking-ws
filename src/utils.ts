import {Bank, Environment} from './constants';
import * as path from 'path';
import {readFileSync} from 'fs';


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
 * @param filePath, full path + filename and it's extension
 * @constructor
 */
async function LoadFileFromPath(filePath: string): Promise<string> {
  const file = readFileSync(filePath, 'utf-8');
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
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm,'') // remove white spaces
}


export {
  GetWSDL,
  Base64DecodeStr,
  LoadFileFromPath,
  FormatCertificate,
}
