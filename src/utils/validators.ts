import {
  validateBIC,
  ValidateBICResult,
  validateIBAN,
  ValidateIBANResult,
  ValidationErrorsBIC,
  ValidationErrorsIBAN
} from 'ibantools';

function IBANValidate(iban: string): { valid: boolean; reasons: { code: number; status: string; } [] } {
  const ibanResult: ValidateIBANResult = validateIBAN(iban);
  if (!ibanResult.valid) {
    return {
      valid: false,
      reasons: getIbanInvalidReasons(ibanResult.errorCodes),
    }
  } else {
    return {valid: true, reasons: []};
  }
}

function getIbanInvalidReasons(errorCodes: ValidationErrorsIBAN[]): { code: number; status: string; }[] {
  const reasons: { code: number; status: string; }[] = [];
  errorCodes.forEach(errorCode => {
    reasons.push({
      code: errorCode,
      status: IBANEnumToString(errorCode)
    })
  });
  return reasons;
}

function IBANEnumToString(code: number): string {
  switch (code) {
    case 0:
      return 'NoIBANProvided';
    case 1:
      return 'NoIBANCountry';
    case 2:
      return 'WrongBBANLength';
    case 3:
      return 'WrongBBANFormat';
    case 4:
      return 'ChecksumNotNumber';
    case 5:
      return 'WrongIBANChecksum';
    case 6:
      return 'WrongAccountBankBranchChecksum';
    default:
      return '';
  }
}


function BICValidate(iban: string): { valid: boolean; reasons: { code: number; status: string; } [] } {
  const bicResult: ValidateBICResult = validateBIC(iban);
  if (!bicResult.valid) {
    return {
      valid: false,
      reasons: getBicInvalidReasons(bicResult.errorCodes),
    }
  } else {
    return {valid: true, reasons: []};
  }
}

function getBicInvalidReasons(errorCodes: ValidationErrorsBIC[]): { code: number; status: string; }[] {
  const reasons: { code: number; status: string; }[] = [];
  errorCodes.forEach(errorCode => {
    reasons.push({
      code: errorCode,
      status: BICEnumToString(errorCode)
    })
  });
  return reasons;
}

function BICEnumToString(code: number): string {
  switch (code) {
    case 0:
      return 'NoBICProvided';
    case 1:
      return 'NoBICCountry';
    case 2:
      return 'WrongBICFormat';
    default:
      return '';
  }
}


export {
  IBANValidate,
  BICValidate,
}
