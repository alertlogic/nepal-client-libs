import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AecontentClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('Aecontent Client Test Suite:', () => {
    describe('when searching', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AecontentClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AecontentClient.getByPath('fake', 1234);
            expect(stub.callCount).to.equal(1);
        });
    });

    describe('when using tuning endpoint ', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AecontentClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call getRule() on the AlDefaultClient instance', async () => {
            await AecontentClient.getRule('1234', 'fakeRule');
            expect(stub.callCount).to.equal(1);
        });
    });

});
