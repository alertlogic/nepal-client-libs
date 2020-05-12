import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlbumClient } from '../src/index';

afterEach(() => {
  sinon.restore();
});
describe('Album Client Test Suite:', () => {
  describe('when getting images', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AlbumClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await AlbumClient.getImages({type: 'aws', product: 'bob'});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting shares', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AlbumClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the ALClient instance', async() => {
      await AlbumClient.getShares('1234', {type: 'aws', type_id: '123456789012'});
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when sharing', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AlbumClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call put() on the ALClient instance', async() => {
      await AlbumClient.shareImage('aws', '123456789012');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when unsharing', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AlbumClient['client'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the ALClient instance', async() => {
      await AlbumClient.unshareImage('aws', '123456789012');
      expect(stub.callCount).to.equal(1);
    });
  });

});
