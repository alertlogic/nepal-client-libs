import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlSchedulerClientInstance } from '../src/index';

let schedulerClient:AlSchedulerClientInstance;

beforeEach(() => {
    schedulerClient = new AlSchedulerClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Scheduler Client Test Suite:', () => {
  describe('when fetching a scan status summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(schedulerClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async () => {
      await schedulerClient.getScanStatusSummary('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when fetching target hosts', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(schedulerClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async () => {
      await schedulerClient.getTargetHosts('1234', '3546');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when requesting an asset is scanned', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(schedulerClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async () => {
      await schedulerClient.scanAsset('1234', '3546', 'abc123');
      expect(stub.callCount).to.equal(1);
    });
  });
});
