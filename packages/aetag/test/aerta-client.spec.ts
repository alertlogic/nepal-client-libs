import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlAEtagClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('aetag Client Test Suite:', () => {
    describe('when searching', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AlAEtagClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AlAEtagClient.getByPath('123', 'reponder/test');
            expect(stub.callCount).to.equal(1);
        });
    });
});
