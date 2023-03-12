'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {SEPAPaymentInformationInterface, XLInterface} from '../interfaces';


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
            'NbOfTxs': this.xl.sepa.PmtInf.length, // this.xl.sepa.GrpHdr.NbOfTxs,
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
          'PmtInf': this.getPaymentInfos(),
        }
      }
    };

    return xmlBuilder.create(xlObj, {version: '1.0', encoding: 'utf-8'}).end({pretty: false});
  }

  private getPaymentInfos(): any[] {
    const paymentInfos: SEPAPaymentInformationInterface[] = [];
    for (const pmtInf of this.xl.sepa.PmtInf) {
      paymentInfos.push({
        'PmtInfId': pmtInf.PmtInfId,
        'PmtMtd': pmtInf.PmtMtd,
        'PmtTpInf': {
          'SvcLvl': {
            'Cd': pmtInf.PmtTpInf.SvcLvl.Cd,
          },
        },
        'ReqdExctnDt': pmtInf.ReqdExctnDt,

        'Dbtr': {
          'Nm': pmtInf.Dbtr.Nm,
          'PstlAdr': {
            'Ctry': pmtInf.Dbtr.PstlAdr.Ctry,
            'AdrLine': [
              pmtInf.Dbtr.PstlAdr.AdrLine,
              pmtInf.Dbtr.PstlAdr.AdrLine2,
            ],
          },
          'Id': {
            'OrgId': {
              'Othr': {
                'Id': pmtInf.Dbtr.Id.OrgId.Othr.Id,
                'SchmeNm': {
                  'Cd': pmtInf.Dbtr.Id.OrgId.Othr.SchmeNm.Cd,
                }
              }
            }
          }
        },
        'DbtrAcct': {
          'Id': {
            'IBAN': pmtInf.DbtrAcct.Id.IBAN,
          },
        },
        'DbtrAgt': {
          'FinInstnId': {
            'BIC': pmtInf.DbtrAgt.FinInstnId.BIC,
          },
        },
        'ChrgBr': pmtInf.ChrgBr,
        'CdtTrfTxInf': {
          'PmtId': {
            'InstrId': pmtInf.CdtTrfTxInf.PmtId.InstrId,
            'EndToEndId': pmtInf.CdtTrfTxInf.PmtId.EndToEndId,
          },
          'PmtTpInf': {
            'SvcLvl': {
              'Cd': pmtInf.PmtTpInf.SvcLvl.Cd,
            }
          },
          'Amt': {
            'InstdAmt': {
              '@Ccy': this.xl.sepa.CcyOfTrf,
              '#text': pmtInf.CdtTrfTxInf.Amt.InstdAmt,
            },
          },
          'ChrgBr': pmtInf.CdtTrfTxInf.ChrgBr,
          'CdtrAgt': {
            'FinInstnId': {
              'BIC': pmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC,
            }
          },
          'Cdtr': {
            'Nm': pmtInf.CdtTrfTxInf.Cdtr.Nm,
            'PstlAdr': {
              'Ctry': pmtInf.CdtTrfTxInf.Cdtr.PstlAdr.Ctry,
              'AdrLine': [
                pmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine,
                pmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine2,
              ],
            },
            'Id': {
              'OrgId': {
                'Othr': {
                  'Id': pmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.Id,
                  'SchmeNm': {
                    'Cd': pmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.SchmeNm.Cd,
                  }
                }
              }
            }
          },
          'CdtrAcct': {
            'Id': {
              'IBAN': pmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN,
            }
          },
          'RmtInf': {
            'Ustrd': pmtInf.CdtTrfTxInf.RmtInf.Ustrd,
          }
        }
      } as unknown as SEPAPaymentInformationInterface);
    } 
    
    return paymentInfos;
  }


}

export {
  XL
};
