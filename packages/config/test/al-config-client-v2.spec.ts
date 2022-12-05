import {
  AlDefaultClient,
  AlLocatorService
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import {
  restore,
  SinonSpy,
  stub
} from 'sinon';
import { ALConfigV2 } from '../src/index';

describe('CARGO CLIENT V2', () => {
    let spy: SinonSpy;
    const config = {
        apiBaseURL: 'https://api.cloudinsight.alertlogic.com',
        service: 'config',
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
                const path = `configs`;
                await ALConfigV2.listConfigs(accountId, {'asset_type': 'host'});
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].version).to.equal(config.version);
                expect(spy.getCall(0).args[0].method).to.equal('GET');
                expect(spy.getCall(0).args[0].account_id).to.equal(accountId);
                expect(spy.getCall(0).args[0].path).to.equal(`/${path}`);
                expect(spy.getCall(0).args[0].url).to.equal(`${cargoURL}/${accountId}/${path}`);
            });

        });
    });
});
