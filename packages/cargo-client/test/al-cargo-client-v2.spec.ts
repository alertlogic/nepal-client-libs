import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import {
  restore,
  SinonSpy,
  stub,
} from 'sinon';
import {
  ALCargoV2,
  ExecutionRecordsQueryParamsV2,
} from '../src/index';

describe('CARGO CLIENT V2', () => {
    let spy: SinonSpy;
    const config = {
        apiBaseURL: 'https://api.cloudinsight.alertlogic.com',
        service: 'cargo',
        version: 'v2',
    };
    const cargoURL = `${config.apiBaseURL}/${config.service}/${config.version}`;
    const accountId = '2';

    beforeEach(() => {
      AlLocatorService.setContext( { environment: "production" } );
      return AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
    });
    afterEach(() => restore());

    describe('Schedules', () => {
        describe('When batch delete is called', () => {
            beforeEach(() => {
                spy = stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 204}));
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

        describe('When get list execution records', () => {
            let records = {
                "continuation": "20160801-223000-FB3D65D4-3905-1005-894D-0EA0987B68E5",
                "execution_records" : [
                  {
                    "id": "20160801-183000-FB3D65D4-3905-1005-894D-0EA0987B68E5",
                    "account_id": "13334567",
                    "schedule_id": "FB3D65D4-3905-1005-894D-0EA0987B68E5",
                    "name": "Execution Record Example",
                    "status" : "running",
                    "type": "search",
                    "definition": {
                        "saved_query_id": "27C13BFD-3953-1005-BD8A-0EB9B569AE5D"
                    },
                    "schedule": {
                      "daily": {
                        "hour": 14,
                        "minute": 40
                      },
                    },
                    "scheduled_time" : 1470076200,
                    "subkey": "scheduled/FB3D65D4-3905-1005-894D-0EA0987B68E5",
                    "notify_behavior": "always",
                    "delete_empty_result": true,
                    "run_once": false,
                    "created": {
                      "at": 1470404195,
                      "by": "48B13BFD-3954-1005-BD8A-0EB9B569AE5D"
                    },
                    "modified": {
                      "at": 1470404195,
                      "by": "48B13BFD-3954-1005-BD8A-0EB9B569AE5D"
                    }
                  }
                ]
            };

            beforeEach(() => {
                spy = stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: records }));
            });
            afterEach(() => {
                spy.restore();
            });
            it('Should call the ALCargoV2 execution_record instance\'s GET.', async () => {
                await ALCargoV2.getListExecutionRecords(accountId);
                expect( spy.callCount ).to.equal(1);
                expect( spy.args[0][0].url ).to.equal(`${cargoURL}/${accountId}/execution_record`);
            });

            it('Should call the ALCargoV2 execution_record instance\'s GET. with params', async () => {
                const query = { limit:10, type: 'tableau'} as ExecutionRecordsQueryParamsV2;
                await ALCargoV2.getListExecutionRecords(accountId, query);
                const payload = spy.args[0][0];
                expect( spy.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${cargoURL}/${accountId}/execution_record` );
                expect( payload.params ).to.equal( query );
            });
        });

        describe('When batch delete is called', () => {
            beforeEach(() => {
                spy = stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 204}));
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
