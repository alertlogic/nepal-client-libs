import { LauncherClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'launcher';

afterEach(() => {
  sinon.restore();
});
describe('Launcher Client Test Suite:', () => {
  describe('when getting deployment status', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(LauncherClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await LauncherClient.getDeploymentStatus('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting region map', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(LauncherClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await LauncherClient.getRegionMap();
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting provisioning document', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(LauncherClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await LauncherClient.getProvisioningDocument('6789');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting account asset list', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(LauncherClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await LauncherClient.getAccountAssetList('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting environment asset list', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(LauncherClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await LauncherClient.getEnvironmentAssetList('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });

});
