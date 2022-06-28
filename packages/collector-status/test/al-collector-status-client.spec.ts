import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlCollectorStatusClientInstance } from '../src/index';

let collectorstatusClient:AlCollectorStatusClientInstance;

beforeEach(() => {
    collectorstatusClient = new AlCollectorStatusClientInstance();
});
afterEach(() => {
    sinon.restore();
});
describe('Collectorstatus Client Test Suite:', () => {
    describe('when downloading files', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(collectorstatusClient['client'], 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the AlDefaultClient instance', async () => {
            await collectorstatusClient.getCollectorStatusHistory("2", "asset/key");
            expect(stub.callCount).to.equal(1);
        });
    });

});
