'use strict';

import {
  ValidationInfoInterface,
  XLPaymentInfoValidationInterface,
  XLPaymentInfoValidationResultInterface
} from '../interfaces';
import {BICValidate, IBANValidate} from '../utils/validators';

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
        result.errors = debtorIBAN.reasons;
      }
      const debtorBIC = BICValidate(pmtInf.DbtrAgt.FinInstnId.BIC);
      if (!debtorBIC.valid) {
        result.valid = false;
        result.errors = debtorBIC.reasons;
      }

      const creditorIBAN = IBANValidate(pmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN);
      if (!creditorIBAN.valid) {
        result.valid = false;
        result.errors = creditorIBAN.reasons;
      }
      const creditorBIC = BICValidate(pmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC);
      if (!creditorBIC.valid) {
        result.valid = false;
        result.errors = creditorBIC.reasons;
      }

      // Todo define more validators

      results.PmtInf.push(result);
    }

    return results;
  }

}

export {
  XLValidation
};
