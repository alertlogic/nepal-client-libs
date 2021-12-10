import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlConvergenceUtilityClient } from '../src/index';

afterEach(() => {
    sinon.restore();
});
describe('ConvergenceUtility Client Test Suite:', () => {
    describe('when downloading files', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(AlConvergenceUtilityClient.client, 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await AlConvergenceUtilityClient.getDownloads("2", "lm");
            expect(stub.callCount).to.equal(1);
        });
    });

});
