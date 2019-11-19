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

    const subscriptionIntegrationAccountMock = {
        "accounts":
        [
          {
            "account_id": "12345678",
            "subscriptions":
            [
              {
                "feature": "incidents",
                "subkey": "escalations/primary",
                "name": "Primary Escalations",
                "subscribed": false
              }
            ]
          }
        ]
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

    const notificationsMock = {
        "notifications": [
            {
                "id": "OOOFFF0-1E1A-4744-AB53-AAND",
                "account_id": "12345678",
                "feature": "incidents",
                "subkey": "escalations/critical",
                "status": "published",
                "data": {
                    "service_owners": "can",
                    "put": "whatever",
                    "they": "want",
                    "in": "here",
                    "it": "all",
                    "goes": "to",
                    "whispir": true
                },
                "message_id": "C99506BEB44BF9CF",
                "integration_message_ids": [
                    "A63F81A7-0000000",
                    "C9E0EFB1-47EAAEE95EF6"
                ],
                "created": {
                    "at": 1517314312,
                    "by": "28122406-4A947EA324EF"
                },
                "modified": {
                    "at": 1517324325,
                    "by": "B1E6F70E-8DF1-40DB-"
                }
            }
        ],
        "total_count": 1,
        "continuation_id": "g1lJX1....wf4ZgQ"
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

        describe('When fetching all integration subscriptions by feature', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const feature = "incidents";
                const integrationId = "";
                await AlHeraldClient.getAllIntegrationSubscriptionsByFeature(integrationId, feature);
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/integrations/${integrationId}/subscriptions/${feature}`);
            });
        });

        describe('When fetching all user subscriptions', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const userId = "123456";
                await AlHeraldClient.getAllUserSubscriptions( userId );
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/users/${userId}/subscriptions`);
            });
        });

        describe('When fetching all user subscriptions by feature', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const userId = "123456";
                const feature = "incidents";
                await AlHeraldClient.getAllUserSubscriptionsByFeature( userId, feature );
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/users/${userId}/subscriptions/${feature}`);
            });
        });

        describe('When fetching all integration subscriptions', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const accountId = "123456";
                const integrationId = "245234523453";
                await AlHeraldClient.getIntegrationSubscriptions( accountId, integrationId );
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/integrations/${integrationId}/subscriptions`);
            });
        });

        describe('When fetching all integration subscriptions by feature', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const accountId = "123456";
                const integrationId = "245234523453";
                const feature = "incidents";
                await AlHeraldClient.getIntegrationSubscriptionsByFeature( accountId, integrationId, feature );
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/integrations/${integrationId}/subscriptions/${feature}`);
            });
        });

        describe('When fetching all user subscriptions', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionIntegrationAccountMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const accountId = "123456";
                const userId = "245234523453";
                await AlHeraldClient.getUserSubscriptions( accountId, userId );
                expect( stub.callCount ).to.equal(1);
                expect( stub.args[0][0].url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/users/${userId}/subscriptions`);
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
            it('Should call the AlHeraldClient instance\'s PUT.', async () => {
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

    describe('Notifications ', () => {
        const notificationId = "1234567890";
        const accountId= "123";
        const query = { since: "10 nov 2019", limit: 5, until: "15 nov 2019" };
        const feature = "incidents";
        const notificationPayloadMock = {
            "feature": "incidents",
            "subkey": "escalations/critical",
            "data": {
                "it": "all",
                "goes": "to",
                "whispir": true
            },
            "attachments": [
                {
                "name": "filename.png",
                "description": "This is an optional description for the attachment",
                "url": "https://example.com/info.png"
                }
            ]
        };

        describe('When performing a get notification by id', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock.notifications[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                await AlHeraldClient.getNotificationsById( notificationId );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/notifications/${notificationId}` );
            });
        });

        describe('When performing a get notifications by account', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                await AlHeraldClient.getNotificationsByAccountId( accountId, query );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications` );
                expect( payload.params ).to.equal( query );
            });
        });

        describe('When performing a get notification by account and by notification id', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock.notifications[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                await AlHeraldClient.getNotificationsByIdAndByAccountId( accountId, notificationId );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications/id/${notificationId}` );
            });
        });

        describe('When performing a get sent notifications by incident id', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const incidentId = "abcdfe";
                await AlHeraldClient.getSentNotificationsByIncidentId( accountId, incidentId );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications/features/incidents/incidents/${incidentId}` );
            });
        });

        describe('When performing a get notifications by account and by feature', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                await AlHeraldClient.getNotificationsByFeature( accountId, feature, query );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications/${feature}` );
            });
        });

        describe('When performing a get notifications by account, by feature id and by subscription', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: notificationsMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const subscription = "escalations/critical";
                await AlHeraldClient.getNotificationsByFeatureBySubscription( accountId, feature, subscription, query );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications/${feature}/${subscription}` );
            });
        });

        describe('When performing a sent notification', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock.notifications[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.sendNotification( accountId, notificationPayloadMock );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications` );
            });
        });

        describe('When performing an update notification', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: notificationsMock.notifications[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s PUT.', async () => {
                await AlHeraldClient.updateNotification( accountId, notificationId, {status: "published"} );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "PUT" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/notifications/${notificationId}` );
            });
        });
    });

    describe('Subscribers ', () =>{
        const accountId = "12345";
        const feature = "feature";
        const subkey = "feature/primary";

        describe('When performing a get subscribers', () => {
            const accountsMock = [];
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {subscribers: accountsMock }}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const result = await AlHeraldClient.getSubscribers(accountId,feature,subkey );

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/subscribers/${feature}/${subkey}` );
                expect( result ).to.equal( accountsMock );
            });
        });

        describe('When performing a get subscribers account ids', () => {
            const accountsIdMock = ["abc","def"];
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {account_ids: accountsIdMock }}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const result = await AlHeraldClient.getSubscriberIds(accountId,feature,subkey );

                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/${accountId}/subscribers/account_ids/${feature}/${subkey}` );
                expect( result ).to.equal( accountsIdMock );
            });
        });
    });

    describe('Subscriptions keys', () =>{
        const accountId = "12345";
        const payloadRequest = {
            "subkey":"feature/primary",
            "name":"Primary Feature",
            "feature":"feature"
        };

        describe('When performing a create subscription key tie to one account', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionkeysMock.subscription_keys[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.createAccountSubscriptionKey( accountId, payloadRequest );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/subscription_keys`);
            });
        });

        describe('When performing a create subscription key', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionkeysMock.subscription_keys[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.createSubscriptionKey( payloadRequest );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal(`${apiBaseURL}/${service}/${version}/subscription_keys`);
            });
        });

        describe('When performing a delete subscription key', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s DELETE.', async () => {
                await AlHeraldClient.deleteAccountSubscriptionKey( accountId, payloadRequest.feature, payloadRequest.subkey );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "DELETE" );
                expect( payload.url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/subscription_keys/${payloadRequest.feature}/${payloadRequest.subkey}`);
            });
        });
    });

    describe('Template mapping', () => {
        const templateMapping = {
            feature: "search",
            subkey_part: "scheduled",
            template_name: "Search Scheduled Report"
        };

        describe('When performing a create template', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: templateMapping}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.createTemplateMapping( templateMapping );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/template_mappings` );
            });
        });

        describe('When performing an update template', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: templateMapping}));
            });
            afterEach(() => {
                stub.restore();
            });

            it('Should call the AlHeraldClient instance\'s PUT.', async () => {
                await AlHeraldClient.updateTemplateMapping(templateMapping.feature, templateMapping.subkey_part, { template_name : "new name" } );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "PUT" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/template_mappings/${templateMapping.feature}/${templateMapping.subkey_part}` );
            });
        });
    });

    describe('Test endpoints', () => {

        describe('When performing a test template', () => {
            const templatePayload = {
                "template_name": "Search Scheduled Report",
                "email": "aem@example.com",
                "data": {},
                "attachments": [
                    {
                        "name": "filename.png",
                        "description": "This is an optional description for the attachment",
                        "url": "https://example.com/info.png"
                    }
                ]
            };

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(
                    Promise.resolve({
                        status: 200,
                        data: {
                            message_id: "654ADB6465A"
                        }
                    })
                );
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.testTemplate( templatePayload );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/template/test` );
            });
        });

        describe('When performing a test webhook', () => {
            const weebhookPayload = {
                "url": "https://webhook.site/123",
                "method": "POST",
                "data": {
                    "some_data": "some_value",
                    "another_data": 123
                }
            };

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(
                    Promise.resolve({
                        status: 200,
                        data: {
                            "response": {
                                "rawbody": "{\r\n\"key1\":123,\r\n\"key2\":\"value2\"\r\n}\r\n",
                                "code": 200
                            }
                        }
                    })
                );
            });

            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s POST.', async () => {
                await AlHeraldClient.testWebhook( weebhookPayload );
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/webhook/test` );
            });
        });

    });
});
