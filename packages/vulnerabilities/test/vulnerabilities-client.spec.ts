import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlVulnerabilitiesClientInstance } from '../src/index';

let vulnerabilitiesClient:AlVulnerabilitiesClientInstance;

beforeEach(() => {
    vulnerabilitiesClient = new AlVulnerabilitiesClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Vulnerabilities Client Test Suite:', () => {
  describe('when getting a single remediation', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(vulnerabilitiesClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await vulnerabilitiesClient.getRemediation('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
});
