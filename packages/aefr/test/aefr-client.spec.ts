import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AefrClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('Aefr Client Test Suite:', () => {
    describe('when searching', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AefrClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AefrClient.getByPath('fake', 1234);
            expect(stub.callCount).to.equal(1);
        });
    });

});
