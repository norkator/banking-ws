'use strict';

import {
  ValidationInfoInterface,
  XLPaymentInfoValidationInterface,
  XLPaymentInfoValidationResultInterface
} from '../interfaces';
import {BICValidate, IBANValidate, InstdAmtValidate} from '../utils/validators';

class XLValidation {

  private readonly xlPmtInfo: XLPaymentInfoValidationInterface;

  constructor(xlPmtInfo: XLPaymentInfoValidationInterface) {
    this.xlPmtInfo = xlPmtInfo;
  }

  public async validatePmtInfos(): Promise<XLPaymentInfoValidationResultInterface> {
    const results: XLPaymentInfoValidationResultInterface = {PmtInf: []};

    for (const pmtInf of this.xlPmtInfo.PmtInf) {
      const result: ValidationInfoInterface = {valid: true, errors: []}

      const debtorIBAN = IBANValidate(pmtInf.DbtrAcct.Id.IBAN);
      if (!debtorIBAN.valid) {
        result.valid = false;
        debtorIBAN.reasons.forEach(r => result.errors.push(r));
      }
      const debtorBIC = BICValidate(pmtInf.DbtrAgt.FinInstnId.BIC);
      if (!debtorBIC.valid) {
        result.valid = false;
        debtorBIC.reasons.forEach(r => result.errors.push(r));
      }

      const creditorIBAN = IBANValidate(pmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN);
      if (!creditorIBAN.valid) {
        result.valid = false;
        creditorIBAN.reasons.forEach(r => result.errors.push(r));
      }
      const creditorBIC = BICValidate(pmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC);
      if (!creditorBIC.valid) {
        result.valid = false;
        creditorBIC.reasons.forEach(r => result.errors.push(r));
      }

      const instructedAmount = InstdAmtValidate(pmtInf.CdtTrfTxInf.Amt.InstdAmt);
      if (!instructedAmount.valid) {
        result.valid = false;
        instructedAmount.reasons.forEach(r => result.errors.push(r));
      }

      if (pmtInf.CdtTrfTxInf.PmtId.EndToEndId.length > 30) {
        result.valid = false;
        result.errors.push({code: 413, status: 'EndToEndId message too long. Max allowed 30 characters.'})
      }

      results.PmtInf.push(result);
    }

    return results;
  }

}

export {
  XLValidation
};
