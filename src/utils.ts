import {v4 as uuidv4} from 'uuid';
import {createHash} from 'crypto';
import {Bank, Environment, OutputEncoding, WsdlType} from './types';
import * as path from 'path';
import {readFileSync} from 'fs';
// @ts-ignore
import * as openssl from 'openssl-nodejs';
// @ts-ignore
import * as moment from 'moment';
import {Buffer} from 'buffer';
import {DOMParser} from 'xmldom';
import * as xmlC14n from 'xml-c14n';


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
        // @ts-ignore
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
    const xmlC14n_ = xmlC14n();
    const canonicalize = xmlC14n_.createCanonicaliser(kind);
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


function CreateCertificate(): Promise<any> {
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
        'req', '-config', { name:'csr.conf', buffer: Buffer.from(config, 'utf-8') }, '-out', 'signing.csr', '-new', '-newkey', 'rsa:2048',
        '-nodes', '-keyout', 'signing.key',
      ], function (err: string, buffer: any) {
        console.log(err.toString(), buffer.toString());
        resolve('');
      });
    } catch (e) {
      return undefined;
    }
  });
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
  CreateCertificate,
}
