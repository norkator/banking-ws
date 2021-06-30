import {Bank, Environment} from './constants';
import * as path from 'path';
import {readFileSync} from 'fs';


/**
 * Get WSDL based on environment
 * @return {string} wsdl file path and name
 */
function GetWSDL(environment: Environment, bank: Bank) {
  return path.join(__dirname + '/wsdl/wsdl_' + bank.toLowerCase() + '_' + environment.toLowerCase() + '.xml');
}

function Base64DecodeStr(b64string: string): string {
  return Buffer.from(b64string, 'base64').toString('utf-8');
}

async function LoadFileFromPath(filePath: string) {
  const file = readFileSync(filePath, 'utf-8');
  return Buffer.from(file).toString('utf-8');
}

export {
  GetWSDL,
  Base64DecodeStr,
  LoadFileFromPath,
}
