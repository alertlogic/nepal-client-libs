import { TacomaClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'tacoma';

afterEach(() => {
  sinon.restore();
});
describe('Tacoma Client Test Suite:', () => {
  describe('when exporting saved views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.exportSavedViewReport('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting saved views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.getSavedView('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when exporting views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.exportViewReport('1234', '7890', '5678', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.getView('1234', '7890', '5678', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when exporting workbooks', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.exportWorkbookReport('1234', '7890', '5678', 'pdf');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting workbook preview', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.getWorkbookPreview('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting workbook', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TacomaClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await TacomaClient.getWorkbook('1234', {filter_subscriptions: 'true'});
      expect(stub.callCount).to.equal(1);
    });
  });
    
});
