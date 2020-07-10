import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlPoliciesClientInstance } from '../src/index';

let policiesClient:AlPoliciesClientInstance;

beforeEach(() => {
  policiesClient = new AlPoliciesClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Policies Client Test Suite:', () => {
  describe('when getting a single policy', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(policiesClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await policiesClient.getPolicy('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when listing policies', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(policiesClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await policiesClient.listPolicies('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
});
