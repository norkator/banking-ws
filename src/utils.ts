import {Bank, Environment} from './constants';
import * as path from 'path';

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

export {
  GetWSDL,
  Base64DecodeStr,
}
