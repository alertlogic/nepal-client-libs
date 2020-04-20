import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlAssetsQueryClientInstance } from '../src/index';

let assetsQueryClient:AlAssetsQueryClientInstance;

beforeEach(() => {
  assetsQueryClient = new AlAssetsQueryClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Assets Query Client Test Suite:', () => {
  describe('when getting health', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getHealth('1234', 'agent');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting health summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getHealthSummary('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when finding an asset', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.findAsset('1234', { uuid: '0987' });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when finding assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.findAssets('1234', { parameters: [{ uuid: '0987' }, { uuid: '4567' }] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting asset details', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getAssetDetails('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting account assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getAccountAssets('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting deployment assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getDeploymentAssets('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting tags summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getTagsSummary('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting topology', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getTopology('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when assessment specs', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getAssessmentSpecs('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting the remediation items list', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getRemediationItemsList('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting the remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getRemediationItems('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when completing remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.completeRemediations('1234', '0987', { operation: 'complete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when disposing remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.disposeRemediations('1234', '0987', { operation: 'dispose_remediations', reason: 'because', comment: 'testing', expires: 1234, remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when planning remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.planRemediations('1234', '0987', { operation: 'plan_remediations', filters: ['because'], user_id: '0987', remediations: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when uncompleteing remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.uncompleteRemediations('1234', '0987', { operation: 'uncomplete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when undisposing remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.undisposeRemediations('1234', '0987', { operation: 'uncomplete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting exposures summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(assetsQueryClient.client, 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await assetsQueryClient.getExposuresDeploymentSummary('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
});
