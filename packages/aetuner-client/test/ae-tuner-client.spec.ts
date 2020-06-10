import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlAETunerClientInstance } from '../src/index';

const serviceName = 'aetuner';
let aeTunerClient:AlAETunerClientInstance;

beforeEach( () => {
    aeTunerClient = new AlAETunerClientInstance();
} );
afterEach(() => {
  sinon.restore();
});
describe('AE Tuner Client Test Suite:', () => {
  describe('when getting elaborations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(aeTunerClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await aeTunerClient.getAnalytics('1234');
      expect(stub.callCount).to.equal(1);
    });
  });

});
