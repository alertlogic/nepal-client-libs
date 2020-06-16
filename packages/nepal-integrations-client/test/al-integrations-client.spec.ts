import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlIntegrationsClient } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "production" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('INTEGRATIONS CLIENT', () => {
    const apiBaseURL = "https://integrations.mdr.global.alertlogic.com";
    const service = "integrations";
    const version = "v1";

    const integrationsMock = [
        {
          "name": "universal_webhook",
          "display name": "Webhook",
          "description": "Webhook Integration Template",
          "category": "webhook"
        },
        {
          "name": "servicenow_webhook",
          "display name": "ServiceNow Webhook",
          "description": "ServiceNow Webhook Integration Template",
          "category": "webhook"
        },
        {
          "name": "jira_email",
          "display name": "Jira Ticketing Email Integration",
          "description": "Jira Ticketing Email Integration Template",
          "category": "email"
        }
    ];

    describe('Integrations ', () => {
        describe('When get types', () => {

            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: integrationsMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const params = { showAll : true };
                const result = await AlIntegrationsClient.getIntegrationTypes();
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${service}/${version}/integration_types` );
                expect( result ).to.equal( integrationsMock );
            });
        });
    });
});
