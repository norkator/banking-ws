'use strict';

import {
  ValidationInfoInterface,
  XLPaymentInfoValidationInterface,
  XLPaymentInfoValidationResultInterface
} from '../interfaces';
import {validateIBAN, ValidateIBANResult, ValidationErrorsIBAN} from 'ibantools';

class XLValidation {

  private readonly xlPmtInfo: XLPaymentInfoValidationInterface;

  constructor(xlPmtInfo: XLPaymentInfoValidationInterface) {
    this.xlPmtInfo = xlPmtInfo;
  }

  public async validatePmtInfos(): Promise<XLPaymentInfoValidationResultInterface> {
    const results: XLPaymentInfoValidationResultInterface = {PmtInf: []};

    for (const pmtInf of this.xlPmtInfo.PmtInf) {
      const result: ValidationInfoInterface = {valid: true, errors: []}

      const debtorIBAN = this.IBANValidate(pmtInf.DbtrAcct.Id.IBAN);
      if (!debtorIBAN.valid) {
        result.valid = false;
        result.errors = debtorIBAN.reasons;
      }

      const creditorIBAN = this.IBANValidate(pmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN);
      if (!creditorIBAN.valid) {
        result.valid = false;
        result.errors = creditorIBAN.reasons;
      }

      results.PmtInf.push(result);
    }

    return results;
  }

  private IBANValidate(iban: string): { valid: boolean; reasons: { code: number; status: string; } [] } {
    const ibanResult: ValidateIBANResult = validateIBAN(iban);
    if (!ibanResult.valid) {
      return {
        valid: false,
        reasons: this.getIbanInvalidReasons(ibanResult.errorCodes),
      }
    } else {
      return {valid: true, reasons: []};
    }
  }

  private getIbanInvalidReasons(errorCodes: ValidationErrorsIBAN[]): { code: number; status: string; }[] {
    const reasons: { code: number; status: string; }[] = [];
    errorCodes.forEach(errorCode => {
      reasons.push({
        code: errorCode,
        status: this.IBANEnumToString(errorCode)
      })
    });
    return reasons;
  }

  private IBANEnumToString(code: number): string {
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


}

export {
  XLValidation
};
