import { ALCargoV2 }  from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe } from 'mocha';
import { SinonSpy, restore, stub } from 'sinon';

describe('CARGO CLIENT V2', () => {
    let spy: SinonSpy;
    const config = {
        apiBaseURL: 'https://api.cloudinsight.alertlogic.com',
        service: 'cargo',
        version: 'v2',
    };
    const cargoURL = `${config.apiBaseURL}/${config.service}/${config.version}`;
    const accountId = '2';

    beforeEach(() => ALClient.setGlobalParameters({noEndpointsResolution: true}));
    afterEach(() => restore());

    describe('Schedules', () => {
        describe('When batch delete is called', () => {
            beforeEach(() => {
                spy = stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 204}));
            });

            it('Should call the batchDeleteSchedules (DELETE).', async () => {
                const ids = ['1','2'];
                const path = `schedule?ids=${ids.join(',')}`;
                await ALCargoV2.batchDeleteSchedules(accountId, ids);
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].version).to.equal(config.version);
                expect(spy.getCall(0).args[0].method).to.equal('DELETE');
                expect(spy.getCall(0).args[0].account_id).to.equal(accountId);
                expect(spy.getCall(0).args[0].path).to.equal(`/${path}`);
                expect(spy.getCall(0).args[0].url).to.equal(`${cargoURL}/${accountId}/${path}`);
            });

        });
    });

    describe('Execution Records', () => {
        describe('When batch delete is called', () => {
            beforeEach(() => {
                spy = stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 204}));
            });

            it('Should call the batchDeleteExecutionRecords (DELETE).', async () => {
                const ids = ['1','2'];
                const path = `execution_record?ids=${ids.join(',')}`;
                await ALCargoV2.batchDeleteExecutionRecords(accountId, ids);
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].version).to.equal(config.version);
                expect(spy.getCall(0).args[0].method).to.equal('DELETE');
                expect(spy.getCall(0).args[0].account_id).to.equal(accountId);
                expect(spy.getCall(0).args[0].path).to.equal(`/${path}`);
                expect(spy.getCall(0).args[0].url).to.equal(`${cargoURL}/${accountId}/${path}`);
            });

        });
    });
});