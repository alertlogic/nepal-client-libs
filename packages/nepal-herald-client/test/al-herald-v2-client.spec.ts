import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlHeraldClientV2 } from '../src/index';

beforeEach(() => {
    AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('HERALD CLIENT V2', () => {
    const apiBaseURL = "https://api.cloudinsight.alertlogic.com";
    const service = "herald";
    const version = "v2";
    const accountId = "345";
    const subscriptionsListV2 = {
        "subscriptions": [
            {
            "notification_type": "incidents/errors",
            "name": "Incidents",
            "id": "95470F2D-59AA-485F-AE4B-A844D81A53C6",
            "created": {
                "by": "70A833AD-184F-4A45-A82B-46F5BA329D4B",
                "at": 1579788887
            },
            "class": "event",
            "active": true,
            "account_id": "12345678"
            }
        ]
    };

    describe('Subscriptions ', () => {
        describe('When getting all subscription', () => {

            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionsListV2}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClientV2 instance\'s GET.', async () => {
                await AlHeraldClientV2.getAllSubscriptionsByAccount(accountId);
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/subscriptions`);
            });

            it('Should call the AlHeraldClientV2 instance\'s GET. with params', async () => {
                const query = {class: 'a', schedule_id: 'b', notification_type: 'c', include_subscribers: true};
                await AlHeraldClientV2.getAllSubscriptionsByAccount(accountId, query);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/subscriptions` );
                expect( payload.params ).to.deep.equal( query );
            });
        });

        describe('When delete subscriptions is called', () => {
            afterEach(() => {
                stub.restore();
            });

            it('Should call the AlHeraldClientV2 instance\'s POST.', async () => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns({ status: 204 });
                await AlHeraldClientV2.deleteSubscriptionsByIds(accountId, ['1', '2']);
                expect(stub.callCount).to.equal(1);
                expect(stub.args[0][0].url).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/subscriptions/batch/delete`);
            });
        });
    });
});
