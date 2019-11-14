import { AlHeraldClient } from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

beforeEach(() => {
    ALClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('HERALD CLIENT', () => {
    const apiBaseURL = "https://api.cloudinsight.alertlogic.com";
    const service = "herald";
    const version = "v1";

    const subscriptionAccountMock = {
        "subscriptions": [
            {
                "subscriber_type": "user",
                "user_id": "ABCGEFG-12545-1234-ABCDEGF",
                "accounts": [
                    {
                        "account_id": "12345678",
                        "subscriptions": [
                            {
                                "feature": "incidents",
                                "subkey": "escalations/primary",
                                "name": "Primary Escalations",
                                "subscribed": false
                            }
                        ]
                    }
                ]
            }
        ],
        "total_count": 1
    };

    const subscriptionkeysMock = {
        "subscription_keys":[
           {
              "subkey":"feature/primary",
              "name":"Primary Feature",
              "modified":{
                 "by":"EA0F10DF-572B-40D6-B467-6C0AA86741DD",
                 "at":1559834538
              },
              "feature":"feature",
              "created":{
                 "by":"8C8177B4-4542-427C-A4D1-0EE4672A223F",
                 "at":1528221409
              }
           },
           {
              "subkey":"feature2/secondary",
              "name":"Secondary Feature 2",
              "modified":{
                 "by":"EA9F00DF-573B-40D6-B567-6C0AA87645DD",
                 "at":1559834539
              },
              "feature":"feature2",
              "created":{
                 "by":"8C9177B4-4542-427C-A4D1-1EE4672A307F",
                 "at":1528221453
              }
           }
        ]
    };

    const integrationsMock = {
        "integrations":[
            {
                "id": "E31302AE",
                "account_id": "12345678",
                "target_url": "https://www.example.com",
                "name": "My Webhook",
                "type": "webhook",
                "created": {
                    "at": 1517452871,
                    "by": "3B8EAFA0"
                },
                "modified": {
                    "at": 1517452871,
                    "by": "3B8EAFA0"
                }
            }
        ]
    };

    const integrationTypesMock = {
        "integration_types":
        [
            {
            "name": "webhooks"
            }
        ]
    };

    describe('Subscriptions ', () => {
        describe('When fetching all subscription keys', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionkeysMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                await AlHeraldClient.getAllSubscriptionKeys();
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/subscription_keys`);
            });
        });

        describe('When fetching all account subscriptions by feature', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const feature = "incidents";
                const accountId = "2";
                await AlHeraldClient.getAllAccountSubscriptionByFeature(accountId,feature);
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/subscriptions/${feature}`);
            });
        });
    });

    describe('Integrations ', () => {
        describe('When performing a create integration', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationsMock.integrations[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                const accountId = "12345678";
                const type = "webhook";
                const payloadData = {
                    name: 'name',
                    target_url: 'https://www.example.com'
                };
                await AlHeraldClient.createIntegration( accountId, type, payloadData );

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/integrations/${type}` );
            });
        });

        describe('When performing a delete integration', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s DELETE.', async () => {
                const accountId = "12345678";
                const integrationId = "ABC";

                await AlHeraldClient.deleteIntegration( accountId, integrationId);

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "DELETE" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/integrations/${integrationId}` );
            });
        });

        describe('When performing a get integration by id', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationsMock.integrations[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const accountId = "12345678";
                const integrationId = "ABC";

                const result = await AlHeraldClient.getIntegrationById( accountId, integrationId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/integrations/${integrationId}` );
                expect( result ).to.equal( integrationsMock.integrations[0] );
            });
        });

        describe('When performing a get integrations by account', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationsMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET by one account.', async () => {
                const accountId = "12345678";
                const integrationId = "ABC";

                const result = await AlHeraldClient.getIntegrationsByAccount( accountId );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/integrations` );
                expect( result ).to.equal( integrationsMock.integrations );
            });
        });

        describe('When performing an update integration', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationsMock.integrations[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                const accountId = "12345678";
                const integrationId = "ABC";
                const payloadData = {
                    name: 'name',
                    target_url: 'https://www.example.com'
                };
                const result = await AlHeraldClient.updateIntegration( accountId, integrationId, payloadData );

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "PUT" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/integrations/${integrationId}` );
                expect( result ).to.equal( integrationsMock.integrations[0] );
            });
        });

        describe('When performing a get integration types', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationTypesMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const result = await AlHeraldClient.getIntegrationTypes();

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/integration_types` );
                expect( result ).to.equal( integrationTypesMock.integration_types );
            });
        });

    });
});
