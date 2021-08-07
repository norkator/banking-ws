import {v4 as uuidv4} from 'uuid';
import {createHash} from 'crypto';
import {Bank, Environment, OutputEncoding, WsdlType} from './types';
import * as path from 'path';
import {readFileSync} from 'fs';
// @ts-ignore
import * as openssl from 'openssl-nodejs';
// @ts-ignore
import * as moment from 'moment';
import * as xmlC14N from 'xml-c14n';
import {Buffer} from 'buffer';
import {DOMParser} from 'xmldom';


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
 * Removes first and last lines
 * @param csr
 * @constructor
 */
function CleanUpCertificate(csr: string): string {
  return csr
    .replace('-----BEGIN CERTIFICATE REQUEST-----', '')
    .replace('-----END CERTIFICATE REQUEST-----', '')
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, '')
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

/**
 * Get expiration date for certificate
 * @param pem
 */
function x509ExpirationDate(pem: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      openssl(['x509', '-enddate', '-noout', '-in', {
        name: 'temp_cert.pem',
        buffer: Buffer.from(pem)
      }], function (err: string, buffer: any) {
        // console.log(err.toString(), buffer.toString());
        const res = buffer.toString().replace('\n', '').split('=');
        const date = moment(res[1], 'MMM D HH:mm:ss yyyy').format('YYYY-MM-DD HH:mm:ss'); // Todo, this date formatting is big question mark
        resolve(date);
      });
    } catch (e) {
      return undefined;
    }
  });
}


/**
 * XML Canonicalize xml node
 * @param xmlStr, xml data as string
 * @param kind, example: http://www.w3.org/TR/2001/REC-xml-c14n-20010315
 * @constructor
 */
function Canonicalize(xmlStr: string, kind: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new DOMParser().parseFromString(xmlStr, 'text/xml');
    const xmlC14n = xmlC14N();
    const canonicalize = xmlC14n.createCanonicaliser(kind);
    // console.log("Canonicalize with algorithm: " + canonicalize.name());
    canonicalize.canonicalise(doc, (err: string, data: string) => {
      err ? reject(err) : resolve(data);
    });
  });
}


/**
 * Get random uuid with or without prefix
 * @param prefix could be like TS-uuid
 * @constructor
 */
function GetUuid(prefix: string | undefined) {
  return prefix ? prefix + '-' + uuidv4() : uuidv4();
}


export {
  LoadFileAsString,
  GetWSDL,
  Base64DecodeStr,
  Base64EncodeStr,
  LoadFileFromPath,
  FormatCertificate,
  CleanUpCertificate,
  RemoveWhiteSpacesAndNewLines,
  Base64EncodedSHA1Digest,
  x509ExpirationDate,
  Canonicalize,
  GetUuid,
}
