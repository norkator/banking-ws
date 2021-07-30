'use strict';

import * as xmlBuilder from 'xmlbuilder';
import {XLInterface} from '../interfaces';


/**
 * SEPA-XML –bank transfer
 * pain.001.001.02
 */
class XL {

  xl: XLInterface;

  constructor(xl: XLInterface) {
    this.xl = xl;
  }


  public async createXmlBody(): Promise<string | undefined> {
    let xlObj: any = {
      'Document': {
        '@xmlns': 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03',
        '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        '@xsi:schemaLocation': 'urn:iso:std:iso:20022:tech:xsd:pain.001.001.03 pain.001.001.03.xsd',
        'CstmrCdtTrfInitn': {

          'GrpHdr': {
            'MsgId': this.xl.GrpHdr.MsgId,
            'CreDtTm': this.xl.GrpHdr.CreDtTm,
            'NbOfTxs': this.xl.GrpHdr.NbOfTxs,
            'InitgPty': {
              'Nm': this.xl.GrpHdr.InitgPty.Nm,
              'PstlAdr': {
                'Ctry': this.xl.GrpHdr.InitgPty.PstlAdr.Ctry,
                'AdrLine': [
                  this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine,
                  this.xl.GrpHdr.InitgPty.PstlAdr.AdrLine2,
                ],
              },
              'Id': {
                'OrgId': {
                  'Othr': {
                    'Id': this.xl.GrpHdr.InitgPty.Id.OrgId.Othr.Id,
                    'SchmeNm': {
                      'Cd': this.xl.GrpHdr.InitgPty.Id.OrgId.Othr.SchmeNm.Cd,
                    }
                  },
                },
              }
            }
          },

          'PmtInf': {
            'PmtInfId': this.xl.PmtInf.PmtInfId,
            'PmtMtd': this.xl.PmtInf.PmtMtd,
            'PmtTpInf': {
              'SvcLvl': {
                'Cd': this.xl.PmtInf.PmtTpInf.SvcLvl.Cd,
              },
            },
            'ReqdExctnDt': this.xl.PmtInf.ReqdExctnDt,

            'Dbtr': {
              'Nm': this.xl.PmtInf.Dbtr.Nm,
              'PstlAdr': {
                'Ctry': this.xl.PmtInf.Dbtr.PstlAdr.Ctry,
                'AdrLine': [
                  this.xl.PmtInf.Dbtr.PstlAdr.AdrLine,
                  this.xl.PmtInf.Dbtr.PstlAdr.AdrLine2,
                ],
              },
              'Id': {
                'OrgId': {
                  'Othr': {
                    'Id': this.xl.PmtInf.Dbtr.Id.OrgId.Othr.Id,
                    'SchmeNm': {
                      'Cd': this.xl.PmtInf.Dbtr.Id.OrgId.Othr.SchmeNm.Cd,
                    }
                  }
                }
              }
            },
            'DbtrAcct': {
              'Id': {
                'IBAN': this.xl.PmtInf.DbtrAcct.Id.IBAN,
              },
            },
            'DbtrAgt': {
              'FinInstnId': {
                'BIC': this.xl.PmtInf.DbtrAgt.FinInstnId.BIC,
              },
            },
            'ChrgBr': this.xl.PmtInf.ChrgBr,
            'CdtTrfTxInf': {
              'PmtId': {
                'InstrId': this.xl.PmtInf.CdtTrfTxInf.PmtId.InstrId,
                'EndToEndId': this.xl.PmtInf.CdtTrfTxInf.PmtId.EndToEndId,
              },
              'PmtTpInf': {
                'SvcLvl': {
                  'Cd': this.xl.PmtInf.PmtTpInf.SvcLvl.Cd,
                }
              },
              'Amt': {
                'InstdAmt': {
                  '@Ccy': this.xl.CcyOfTrf,
                  '#text': this.xl.PmtInf.CdtTrfTxInf.Amt.InstdAmt,
                },
              },
              'ChrgBr': this.xl.PmtInf.CdtTrfTxInf.ChrgBr,
              'CdtrAgt': {
                'FinInstnId': {
                  'BIC': this.xl.PmtInf.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC,
                }
              },
              'Cdtr': {
                'Nm': this.xl.PmtInf.CdtTrfTxInf.Cdtr.Nm,
                'PstlAdr': {
                  'Ctry': this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.Ctry,
                  'AdrLine': [
                    this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine,
                    this.xl.PmtInf.CdtTrfTxInf.Cdtr.PstlAdr.AdrLine2,
                  ],
                },
                'Id': {
                  'OrgId': {
                    'Othr': {
                      'Id': this.xl.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.Id,
                      'SchmeNm': {
                        'Cd': this.xl.PmtInf.CdtTrfTxInf.Cdtr.Id.OrgId.Othr.SchmeNm.Cd,
                      }
                    }
                  }
                }
              },
              'CdtrAcct': {
                'Id': {
                  'IBAN': this.xl.PmtInf.CdtTrfTxInf.CdtrAcct.Id.IBAN,
                }
              },
              'RmtInf': {
                'Ustrd': this.xl.PmtInf.CdtTrfTxInf.RmtInf.Ustrd,
              }
            }
          },

        }
      }
    };

    let xml: xmlBuilder.XMLElement = xmlBuilder.create(xlObj, {version: '1.0', encoding: 'utf-8'});
    return xml.end({pretty: true});
  }

}

export {
  XL
};
