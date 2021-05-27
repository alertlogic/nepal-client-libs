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

});
