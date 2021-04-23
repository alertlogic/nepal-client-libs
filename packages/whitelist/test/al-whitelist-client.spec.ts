import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlwsWhitelistClientInstance } from '../src/index';

let whitelistClient:AlwsWhitelistClientInstance;
const accountId = '2';
const deploymentId = 'AAAA-BBBB-CCCC-DDD';

beforeEach(() => {
  whitelistClient = new AlwsWhitelistClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Whitelist Client Test Suite:', () => {
  describe('when listing tags', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(whitelistClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await whitelistClient.listTags(accountId, deploymentId);
      expect(stub.callCount).to.equal(1);
    });
  });
});

