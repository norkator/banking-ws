// import * as mocha from 'mocha';
import * as chai from 'chai';
import {IBANValidate, BICValidate, InstdAmtValidate} from './validators';

const expect = chai.expect;
describe('Validators', async () => {

  it('should be valid IBAN', async () => {
    const validIBAN = IBANValidate('FI4950009420028730');
    expect(validIBAN.valid).to.be.true;
  });

  it('should be invalid IBAN', async () => {
    const invalidIBAN = IBANValidate('FI123456789123456789123456789');
    expect(invalidIBAN.valid).to.be.false;
    expect(invalidIBAN.reasons[0].code).to.equal(2);
    expect(invalidIBAN.reasons[0].status).to.equal('WrongBBANLength');
    expect(invalidIBAN.reasons[1].code).to.equal(3);
    expect(invalidIBAN.reasons[1].status).to.equal('WrongBBANFormat');
    expect(invalidIBAN.reasons[2].code).to.equal(5);
    expect(invalidIBAN.reasons[2].status).to.equal('WrongIBANChecksum');
  });

  it('should be valid BIC', async () => {
    const validBIC = BICValidate('OKOYFIHH');
    expect(validBIC.valid).to.be.true;
  });

  it('should be invalid BIC', async () => {
    const invalidBIC = BICValidate('BCDEFGHI');
    expect(invalidBIC.reasons[0].code).to.equal(1);
    expect(invalidBIC.reasons[0].status).to.equal('NoBICCountry');
    expect(invalidBIC.valid).to.be.false;
  });

  it('should be valid InstAmt', async () => {
    const decimals = InstdAmtValidate(500.00);
    expect(decimals.valid).to.be.true;
    const decimals2 = InstdAmtValidate(500.25);
    expect(decimals2.valid).to.be.true;
    const decimals3 = InstdAmtValidate(9999999.50);
    expect(decimals3.valid).to.be.true;
  });

  it('should be invalid InstAmt', async () => {
    const invalidDecimals = InstdAmtValidate(500.234);
    expect(invalidDecimals.valid).to.be.false;
    expect(invalidDecimals.reasons[0].code).to.equal(1);
    expect(invalidDecimals.reasons[0].status).to.equal('InstdAmt must have two decimals. Given had 3');
  });

});

