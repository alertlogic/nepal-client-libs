import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AertaClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('Aerta Client Test Suite:', () => {
    describe('when searching', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AertaClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AertaClient.getByPath('fake', 'fake', 1234);
            expect(stub.callCount).to.equal(1);
        });
    });

});
