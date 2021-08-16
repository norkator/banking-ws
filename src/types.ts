export type Environment = 'TEST' | 'PRODUCTION';
export type Bank = 'Samlink';
export type WsdlType = 'cert_' | '';
export type FileType = 'XL' | 'XT';
export type Status = 'NEW' | 'DLD' | 'ALL' | '';
export type Currency = 'EUR' | 'USD';
export type PaymentMethod = 'TRF';
export type ServiceLevel = 'SLEV';
export type Command = 'GetCertificate' | 'RenewCertificate';
export type Service = 'ISSUER' | 'MATU';
export type OutputEncoding = 'utf-8' | 'base64';
export type Language = 'FI' | 'EN' | 'SV';
export type Country = 'FI' | 'SE'; // Finland, Sweden,
export type Code = 'BANK';
export type BIC =
    'HELSFIHH'
    | 'BIGKFIH1'
    | 'CITIFIHX'
    | 'DABAFIHH'
    | 'DABAFIHX'
    | 'DNBAFIHX'
    | 'HANDFIHH'
    | 'HOLVFIHH'
    | 'NDEAFIHH'
    | 'OMASP'
    | 'OKOYFIHH'
    | 'POPFFI22'
    | 'SBANFIHH'
    | 'ESSEFIHX'
    | 'SWEDFIHH'
    | 'ITELFIHH'
    | 'AABAFI22'
