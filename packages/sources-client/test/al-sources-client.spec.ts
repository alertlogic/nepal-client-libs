import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlSourcesClientInstance } from '../src/index';

let sourcesClient:AlSourcesClientInstance;

beforeEach(() => {
    sourcesClient = new AlSourcesClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Sources Client Test Suite:', () => {
  describe('when fetching sources', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await sourcesClient.getSources('1234', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when fetching a single source', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async () => {
      await sourcesClient.getSource('1234', '3546');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when creating a source', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance', async () => {
      await sourcesClient.createSource('1234', {});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when replacing a source', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call put() on the AlDefaultClient instance', async () => {
      await sourcesClient.replaceSource('1234', 'bla', {});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when deleting a source', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the AlDefaultClient instance', async () => {
      await sourcesClient.deleteSource('1234','abc');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when deleting all sources', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(sourcesClient['client'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the AlDefaultClient instance', async () => {
      await sourcesClient.deleteAllSources('1234','abc');
      expect(stub.callCount).to.equal(1);
    });
  });
});
