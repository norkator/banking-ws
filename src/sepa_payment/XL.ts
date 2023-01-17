'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {XLInterface} from '../interfaces';


/**
 * SEPA-XML –bank transfer
 * Pain001.001.03
 */
class XL {

  private readonly xl: XLInterface;

  constructor(xl: XLInterface) {
    this.xl = xl;
  }


  public async createSepaXmlMessage(): Promise<string> {
    const xlObj = {
      'Document': {
        '@xmlns': 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03 pain.001.001.03.xsd',
        'CstmrCdtTrfInitn': {

          'GrpHdr': {
            'MsgId': this.xl.sepa.GrpHdr.MsgId,
            'CreDtTm': this.xl.sepa.GrpHdr.CreDtTm,
            'NbOfTxs': this.xl.sepa.GrpHdr.NbOfTxs,
            'InitgPty': {
              'Nm': this.xl.sepa.GrpHdr.InitgPty.Nm,
              'PstlAdr': {
                'Ctry': this.xl.sepa.GrpHdr.InitgPty.PstlAdr.Ctry,
                'AdrLine': [
                  this.xl.sepa.GrpHdr.InitgPty.PstlAdr.AdrLine,
                  this.xl.sepa.GrpHdr.InitgPty.PstlAdr.AdrLine2,
                ],
              },
              'Id': {
                'OrgId': {
                  'Othr': {
                    'Id': this.xl.sepa.GrpHdr.InitgPty.Id.OrgId.Othr.Id,
                    'SchmeNm': {
                      'Cd': this.xl.sepa.GrpHdr.InitgPty.Id.OrgId.Othr.SchmeNm.Cd,
                    }
                  },
                },
              }
            }
          },

          'PmtInf': {
            'PmtInfId': this.xl.sepa.PmtInf.PmtInfId,
            'PmtMtd': this.xl.sepa.PmtInf.PmtMtd,
            'PmtTpInf': {
              'SvcLvl': {
                'Cd': this.xl.sepa.PmtInf.PmtTpInf.SvcLvl.Cd,
              },
            },
            'ReqdExctnDt': this.xl.sepa.PmtInf.ReqdExctnDt,

            'Dbtr': {
              'Nm': this.xl.sepa.PmtInf.Dbtr.Nm,
              'PstlAdr': {
                'Ctry': this.xl.sepa.PmtInf.Dbtr.PstlAdr.Ctry,
                'AdrLine': [
                  this.xl.sepa.PmtInf.Dbtr.PstlAdr.AdrLine,
                  this.xl.sepa.PmtInf.Dbtr.PstlAdr.AdrLine2,
                ],
              },
              'Id': {
                'OrgId': {
                  'Othr': {
                    'Id': this.xl.sepa.PmtInf.Dbtr.Id.OrgId.Othr.Id,
                    'SchmeNm': {
                      'Cd': this.xl.sepa.PmtInf.Dbtr.Id.OrgId.Othr.SchmeNm.Cd,
                    }
                  }
                }
              }
            },
            'DbtrAcct': {
              'Id': {
                'IBAN': this.xl.sepa.PmtInf.DbtrAcct.Id.IBAN,
              },
            },
            'DbtrAgt': {
              'FinInstnId': {
                'BIC': this.xl.sepa.PmtInf.DbtrAgt.FinInstnId.BIC,
              },
            },
            'ChrgBr': this.xl.sepa.PmtInf.ChrgBr,
            'CdtTrfTxInf': {
              'PmtId': {
                'InstrId': this.xl.sepa.PmtInf.CdtTrfTxInf.PmtId.InstrId,
                'EndToEndId': this.xl.sepa.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
              },
              'PmtTpInf': {
                'SvcLvl': {
                  'Cd': this.xl.sepa.PmtInf.PmtTpInf.SvcLvl.Cd,
                }
              },
              'Amt': {
                'InstdAmt': {
                  '@Ccy': this.xl.sepa.CcyOfTrf,
                  '#text': this.xl.sepa.PmtInf.CdtTrfTxInf.Amt.InstdAmt,
                },
              },
              'ChrgBr': this.xl.sepa.PmtInf.CdtTrfTxInf.ChrgBr,
              'CdtrAgt': {
                'FinInstnId': {
                  'BIC': this.xl.sepa.PmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC,
                }
              },
              'Cdtr': {
                'Nm': this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.Nm,
                'PstlAdr': {
                  'Ctry': this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.Ctry,
                  'AdrLine': [
                    this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine,
                    this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine2,
                  ],
                },
                'Id': {
                  'OrgId': {
                    'Othr': {
                      'Id': this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.Id,
                      'SchmeNm': {
                        'Cd': this.xl.sepa.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.SchmeNm.Cd,
                      }
                    }
                  }
                }
              },
              'CdtrAcct': {
                'Id': {
                  'IBAN': this.xl.sepa.PmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN,
                }
              },
              'RmtInf': {
                'Ustrd': this.xl.sepa.PmtInf.CdtTrfTxInf.RmtInf.Ustrd,
              }
            }
          },

        }
      }
    };

    return xmlBuilder.create(xlObj, {version: '1.0', encoding: 'utf-8'}).end({pretty: false});
  }

}

export {
  XL
};
