import { CargoClient } from '../src/index';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = "cargo";

afterEach(() => {
  sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('CARGO CLIENT - Test Suite', () => {
  // Test CargoReportRequest.
  const testReq = { 
    name: 'test',
    type: 'test',
    definition: {
      saved_query_id: 'testId'
    }
  };
  const scheduleReportReq = {
    report_id: '1'
  };
  const queryParamsSchedule = {
    limit: 100,
    order: 'desc',
    report_id: '1',
    report_type: 'search'
  }
  describe('When creating report', () => { 
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s POST.', async () => {
      await CargoClient.createReport('2',testReq);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching report', () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.getReport('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When updating report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s SET.', async () => {
      await CargoClient.updateReport('2', '1', testReq); 
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When deleting report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s DELETE.', async () => {
      await CargoClient.removeReport('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching list of reports', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.listReports('2');
      await CargoClient.listReports('2', { report_type: 'search' });
      expect(stub.callCount).to.equal(2);
    });
  });
  describe('When scheduling report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s POST with ReportScheduleRequest', async () => {
      await CargoClient.scheduleReport('2', scheduleReportReq);
      expect(stub.callCount).to.equal(1);
    });
    it('Should call the ALClient instance\'s POST with ReportScheduleOnceRequest.', async () => {
      await CargoClient.scheduleReport('2', testReq);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When canceling report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s POST.', async () => {
      await CargoClient.cancelScheduledReport('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When removing report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s DELETE.', async () => {
      await CargoClient.removeScheduledReport('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching scheduled report', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.getScheduledReport('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching scheduled report result', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.getScheduledReportResult('2', '1', 'resultTest');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching scheduled report result archive', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.getScheduledReportResultArchive('2', '1');
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching list of scheduled reports', async () => {
    beforeEach(() => {
      stub = sinon.stub(CargoClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CargoClient.listScheduledReports('2', queryParamsSchedule);
      await CargoClient.listScheduledReports('2');
      expect(stub.callCount).to.equal(2);
    });
  });
});
