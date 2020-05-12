import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { ALTacoma } from '../src/index';

const serviceName = 'tacoma';

afterEach(() => {
  sinon.restore();
});
describe('Tacoma Client Test Suite:', () => {
  describe("Something", () => {
      it("should work", () => {
          expect( true ).to.equal( true );
      } );
  } );
  xdescribe('when exporting saved views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.exportSavedViewReport('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when getting saved views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.getSavedView('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when exporting views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.exportViewReport('1234', '7890', '5678', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when getting views', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.getView('1234', '7890', '5678', '0987');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when exporting workbooks', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.exportWorkbookReport('1234', '7890', '5678', 'pdf');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when getting workbook preview', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.getWorkbookPreview('1234', '7890', '5678');
      expect(stub.callCount).to.equal(1);
    });
  });
  xdescribe('when getting workbook', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(ALTacoma['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance', async() => {
      await ALTacoma.getWorkbook('1234', {filter_subscriptions: 'true'});
      expect(stub.callCount).to.equal(1);
    });
  });

});
