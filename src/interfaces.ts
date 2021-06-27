import {Bank} from './constants';

export interface UserParamsInterface {
  bank: Bank,
  signingPrivate_key: string,
  signingCertificate: string;
  customerId: string
}

export interface FileReferenceInterface {
  reference: string;
}

export interface SoftwareIdInterface {
  name: string;
  version: string;
}
