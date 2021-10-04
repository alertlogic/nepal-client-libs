import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlCredentialsClientInstance } from '../src/index';
import { AlCredentialslientV2Instance } from '../src/index';

let credentialsClient:AlCredentialsClientInstance;
let credentialsClientV2: AlCredentialslientV2Instance;

beforeEach(() => {
    credentialsClient = new AlCredentialsClientInstance();
    credentialsClientV2 = new AlCredentialslientV2Instance();
});
afterEach(() => {
  sinon.restore();
});
describe('Credentials Client Test Suite:', () => {
  describe('when creating credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance', async () => {
      await credentialsClientV2.create('1234', {name: 'my creds'});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when deleting credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the AlDefaultClient instance', async () => {
      await credentialsClientV2.delete('1234', '3546');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when retreiving a single credential', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async () => {
      await credentialsClientV2.getById('1234', '3546');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when retreiving all credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async () => {
      await credentialsClientV2.listAll('1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when creating host scan credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call put() on the AlDefaultClient instance', async () => {
      await credentialsClient.storeHostScanCredential('1234', '456', 'deployment','1234',{});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when deleting host scan credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the AlDefaultClient instance', async () => {
      await credentialsClient.deleteHostScanCredentials('1234', '456', 'deployment','bla', '1234');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting host scan credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await credentialsClient.getHostScanCredentials('1234', '456', 'deployment');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting all host scan credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await credentialsClient.getAllHostScanCredentials('1234', '456');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when storing host scan credentials', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(credentialsClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call put() on the AlDefaultClient instance', async () => {
      await credentialsClient.storeHostScanCredential('1234', '456', 'deployment', '1233', {});
      expect(stub.callCount).to.equal(1);
    });
  });
});
