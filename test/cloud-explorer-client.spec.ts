import { CloudExplorerClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'cloud_explorer';

afterEach(() => {
  sinon.restore();
});
describe('Cloud Explorer Client Test Suite:', () => {
  describe('when supported regions', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(CloudExplorerClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await CloudExplorerClient.getSupportedRegions();
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when fetching third-party role policy', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(CloudExplorerClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await CloudExplorerClient.getRolePolicy('iam');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when initiating discovery', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(CloudExplorerClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      await CloudExplorerClient.initiateDiscovery('1234', '0987', 'ec2');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when validating external credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(CloudExplorerClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      const credential = {"credential": {"name": "Ozone", "iam_role": {"arn": "arn:aws:iam::123456789016:role/outcomes_role", "external_id": "0000-0001", }, "type": "iam_role"} };
      await CloudExplorerClient.validateExternalCredentials(credential);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when validating stored credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(CloudExplorerClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      await CloudExplorerClient.validateStoredCredentials('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
    
});
