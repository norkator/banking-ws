import * as chai from 'chai';
import {SEPAPaymentInfoValidation} from '../index';
import {XLPaymentInfoValidationInterface} from '../interfaces';

const expect = chai.expect;
describe('XLValidation', async () => {

  it('should return valid xl validation result', async () => {
    const xlPmtInfo: XLPaymentInfoValidationInterface = {
      'PmtInf': [{
        'PmtInfId': '20230921-52329',
        'PmtMtd': 'TRF',
        'PmtTpInf': {
          'SvcLvl': {
            'Cd': 'BANK'
          }
        },
        'ReqdExctnDt': '2023-09-22',
        'Dbtr': {
          'Nm': 'Magnificent Company',
          'PstlAdr': {
            'Ctry': 'FI',
            'AdrLine': 'Fake road 12',
            'AdrLine2': 'FI-12345 Dummy'
          },
          'Id': {
            'OrgId': {
              'Othr': {
                'Id': '123456789',
                'SchmeNm': {
                  'Cd': 'BANK'
                }
              }
            }
          }
        },
        'DbtrAcct': {
          'Id': {
            'IBAN': 'FI5945030010670044'
          }
        },
        'DbtrAgt': {
          'FinInstnId': {
            'BIC': 'ITELFIHH'
          }
        },
        'ChrgBr': 'SLEV',
        'CdtTrfTxInf': {
          'PmtId': {
            'InstrId': 'dummy InstrId',
            'EndToEndId': 'in_valid_limits'
          },
          'PmtTpInf': {
            'SvcLvl': {
              'Cd': 'BANK'
            }
          },
          'Amt': {
            'InstdAmt': '9.90'
          },
          'ChrgBr': 'SLEV',
          'CdtrAgt': {
            'FinInstnId': {
              'BIC': 'ITELFIHH'
            }
          },
          'Cdtr': {
            'Nm': 'Magnificent Company',
            'PstlAdr': {
              'Ctry': 'FI',
              'AdrLine': 'Fake road 12',
              'AdrLine2': 'FI-12345 Dummy'
            },
            'Id': {
              'OrgId': {
                'Othr': {
                  'Id': '123456789',
                  'SchmeNm': {
                    'Cd': 'BANK'
                  }
                }
              }
            }
          },
          'CdtrAcct': {
            'Id': {
              'IBAN': 'FI5945030010670044'
            }
          },
          'RmtInf': {
            'Ustrd': '123456789'
          }
        }
      }]
    }

    const validation = await SEPAPaymentInfoValidation(xlPmtInfo);
    if (validation.PmtInf[0].errors.length > 0) {
      console.error(validation.PmtInf[0].errors)
    }
    expect(validation.PmtInf[0].valid).to.equal(true);
  });

  it('should return invalid xl validation result with expected set of errors', async () => {
    const xlPmtInfo: XLPaymentInfoValidationInterface = {
      'PmtInf': [{
        'PmtInfId': '20230921-52329',
        'PmtMtd': 'TRF',
        'PmtTpInf': {
          'SvcLvl': {
            'Cd': 'BANK'
          }
        },
        'ReqdExctnDt': '2023-09-22',
        'Dbtr': {
          'Nm': 'Magnificent Company',
          'PstlAdr': {
            'Ctry': 'FI',
            'AdrLine': 'Fake road 12',
            'AdrLine2': 'FI-12345 Dummy'
          },
          'Id': {
            'OrgId': {
              'Othr': {
                'Id': '123456789',
                'SchmeNm': {
                  'Cd': 'BANK'
                }
              }
            }
          }
        },
        'DbtrAcct': {
          'Id': {
            'IBAN': 'FI1234567890'
          }
        },
        'DbtrAgt': {
          'FinInstnId': {
            'BIC': 'ITELFIHH'
          }
        },
        'ChrgBr': 'SLEV',
        'CdtTrfTxInf': {
          'PmtId': {
            'InstrId': 'dummy InstrId',
            'EndToEndId': 'way-too-long-message-for-end-to-end-field'
          },
          'PmtTpInf': {
            'SvcLvl': {
              'Cd': 'BANK'
            }
          },
          'Amt': {
            'InstdAmt': '999.9999999'
          },
          'ChrgBr': 'SLEV',
          'CdtrAgt': {
            'FinInstnId': {
              'BIC': 'ITELFIHH'
            }
          },
          'Cdtr': {
            'Nm': 'Magnificent Company',
            'PstlAdr': {
              'Ctry': 'FI',
              'AdrLine': 'Fake road 12',
              'AdrLine2': 'FI-12345 Dummy'
            },
            'Id': {
              'OrgId': {
                'Othr': {
                  'Id': '123456789',
                  'SchmeNm': {
                    'Cd': 'BANK'
                  }
                }
              }
            }
          },
          'CdtrAcct': {
            'Id': {
              'IBAN': 'FI1234567890'
            }
          },
          'RmtInf': {
            'Ustrd': '123456789'
          }
        }
      }]
    }

    const validation = await SEPAPaymentInfoValidation(xlPmtInfo);
    expect(validation.PmtInf[0].errors.length).to.equal(8);

    expect(validation.PmtInf[0].errors[0].status).to.equal('WrongBBANLength');
    expect(validation.PmtInf[0].errors[1].status).to.equal('WrongBBANFormat');
    expect(validation.PmtInf[0].errors[6].code).to.equal(1);
    expect(validation.PmtInf[0].errors[7].code).to.equal(413);
  });

});

