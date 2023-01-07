import {v4 as uuidv4} from 'uuid';
import {OutputEncoding} from '../types';
import {readFileSync} from 'fs';
const openssl = require('openssl-nodejs');
// @ts-ignore
// import moment from 'moment';
import * as moment from 'moment'
import {Buffer} from 'buffer';
import {DOMParser} from '@xmldom/xmldom';

const xmlC14n = require('xml-c14n');
import {parseString} from "xml2js";


/**
 * @param fullPath, path and filenames with extension
 * @constructor
 */
function LoadFileAsString(fullPath: string): string {
  const file = readFileSync(fullPath, 'utf-8');
  return Buffer.from(file).toString('utf-8');
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
 * Get expiration date for certificate
 * @param pem
 */
function x509ExpirationDate(pem: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      openssl(['x509', '-enddate', '-noout', '-in', {
        name: 'temp_cert.pem',
        buffer: Buffer.from(pem)
      }], function (err: string, buffer: Buffer) {
        // console.log(err.toString(), buffer.toString());
        const res = buffer.toString().replace('\n', '').split('=');
        // Todo, this date formatting is big question mark
        const date = moment(res[1], 'MMM D HH:mm:ss yyyy').format('YYYY-MM-DD HH:mm:ss');
        resolve(date);
      });
    } catch (e) {
      reject(e);
    }
  });
}


/**
 * XML Canonicalize xml node
 * @param xmlStr, xml data as string
 * @param kind, example: http://www.w3.org/TR/2001/REC-xml-c14n-20010315
 * @constructor
 */
function CanonicalizeWithDomParser(xmlStr: string, kind: string): Promise<string> {
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


function Canonicalize(doc: Node, kind: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xmlC14n_ = xmlC14n();
    const canonicalize = xmlC14n_.createCanonicaliser(kind);
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
function GetUuid(prefix: string | undefined): string {
  return prefix ? prefix + '-' + uuidv4() : uuidv4();
}


/**
 * Add begin, end tags and split it to PEM like 64 char/line
 * @param certificate
 * @param maxLength
 * @constructor
 */
function FormatResponseCertificate(certificate: string, maxLength = 64): string {
  let cert = '-----BEGIN CERTIFICATE-----\n';
  const numOfLines = Math.floor(certificate.length / maxLength);
  for (let i = 0; i < numOfLines + 1; i++) {
    cert += certificate.substr(i * maxLength, maxLength);
    if (i !== numOfLines) {
      cert += "\n";
    }
  }
  cert += '\n';
  cert += '-----END CERTIFICATE-----';
  return cert;
}

/**
 * Parse string xml into object like form
 * @param xmlString, xml response data
 * @constructor
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
async function ParseXml(xmlString: string): Promise<any> {
  return await new Promise((resolve, reject) => parseString(xmlString, (err, jsonData) => {
    if (err) {
      reject(err);
    }
    resolve(jsonData);
  }));
}

/**
 * Since only '0' is successful, will throw error with every other and use its own response texp
 * @param rc
 * @param responseText
 */
function HandleResponseCode(rc: string, responseText: string): void {
  if (rc === '5' || rc === '6' || rc === '7' || rc === '8' || rc === '12' || rc === '26' || rc === '30') {
    throw new Error(responseText);
  }
}


export {
  LoadFileAsString,
  Base64DecodeStr,
  Base64EncodeStr,
  LoadFileFromPath,
  CleanUpCertificate,
  RemoveWhiteSpacesAndNewLines,
  x509ExpirationDate,
  CanonicalizeWithDomParser,
  Canonicalize,
  GetUuid,
  FormatResponseCertificate,
  ParseXml,
  HandleResponseCode,
}
