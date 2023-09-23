import * as chai from 'chai';

const expect = chai.expect;
describe('XLValidation', async () => {

  it('should return valid xl validation result', async () => {
    expect('').to.equal('');
  });

  it('should return invalid xl validation result with expected set of errors', async () => {
    expect('').to.equal('dummy');
  });

});

