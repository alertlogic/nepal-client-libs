import { AssetsQueryClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

afterEach(() => {
  sinon.restore();
});
describe('Assets Query Client Test Suite:', () => {
  describe('when getting health', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getHealth('1234', 'agent');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting health summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getHealthSummary('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when finding an asset', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.findAsset('1234', { uuid: '0987' });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when finding assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.findAssets('1234', { parameters: [{ uuid: '0987' }, { uuid: '4567' }] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting asset details', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getAssetDetails('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting account assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getAccountAssets('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting deployment assets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getDeploymentAssets('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting tags summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getTagsSummary('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting topology', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getTopology('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when assessment specs', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getAssessmentSpecs('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting the remediation items list', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getRemediationItemsList('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting the remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getRemediationItems('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when completing remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async () => {
      await AssetsQueryClient.completeRemediations('1234', '0987', { operation: 'complete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when disposing remediation items', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async () => {
      await AssetsQueryClient.disposeRemediations('1234', '0987', { operation: 'dispose_remediations', reason: 'because', comment: 'testing', expires: 1234, remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when planning remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async () => {
      await AssetsQueryClient.planRemediations('1234', '0987', { operation: 'plan_remediations', filters: ['because'], user_id: '0987', remediations: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when uncompleteing remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async () => {
      await AssetsQueryClient.uncompleteRemediations('1234', '0987', { operation: 'uncomplete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when undisposing remediations', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async () => {
      await AssetsQueryClient.undisposeRemediations('1234', '0987', { operation: 'uncomplete_remediations', remediation_items: ['4567', '7654'] });
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting exposures summary', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AssetsQueryClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async () => {
      await AssetsQueryClient.getExposuresDeploymentSummary('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
});
