'use strict';

import {XLPaymentInfoValidationInterface, XLPaymentInfoValidationResultInterface} from '../interfaces';


class XLValidation {

  private readonly xlPmtInfo: XLPaymentInfoValidationInterface;

  constructor(xlPmtInfo: XLPaymentInfoValidationInterface) {
    this.xlPmtInfo = xlPmtInfo;
  }

  public async validatePmtInfos(): Promise<XLPaymentInfoValidationResultInterface> {
    const result: XLPaymentInfoValidationResultInterface = {PmtInf: []};

    for (const pmtInf of this.xlPmtInfo.PmtInf) {
      // pmtInf.DbtrAcct.Id.IBAN// DbtrAcct
      // pmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN
    }

    return null;
  }

}

export {
  XLValidation
};
