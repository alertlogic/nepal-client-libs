import {
  AIMSOrganization,
  AlDefaultClient,
  AlLocation,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlEndpointsClientInstance } from '../src';

describe('Endpoints API Client', () => {
    let requestStub:sinon.SinonSpy;
    let getServiceEndpointsStub: sinon.SinonSpy;
    let getOrgStub:sinon.SinonSpy;
    let lookupDefaultServiceEndpointStub:sinon.SinonSpy;
    let apiBaseURL: string;
    let globalBaseURL: string;
    let endpointsApiURL: string;
    const accountIdMock:string = "67108880";
    const organizationIdMock:string = "0000-AA-12345678-BBCD-ZZZZ";
    const organizationMock:AIMSOrganization = {
        account_id: accountIdMock,
        id: organizationIdMock,
        location_id: "defender-us-ashburn",
        version: 1,
        created: {
            at: 123456789,
            by: "0000-00-00000000-0000-0000"
        },
        modified: {
            at: 123456789,
            by: "0000-00-00000000-0000-0000"
        },
        url: "blahblahblah"
    };

    let endpointsClient = new AlEndpointsClientInstance();

    beforeEach(() => {
        AlLocatorService.setContext( { environment: "integration" } );
        AlDefaultClient.reset()
                .setGlobalParameters( { noEndpointsResolution: true } );
        requestStub = sinon.stub(AlDefaultClient as any, "axiosRequest")
                .returns( Promise.resolve( { status: 200, data: 'Some result', config: {} } ) );
        getServiceEndpointsStub = sinon.stub(AlDefaultClient, 'resolveDefaultEndpoints')
                .returns( Promise.resolve({}) );
        lookupDefaultServiceEndpointStub = sinon.stub(AlDefaultClient, 'lookupDefaultServiceEndpoint')
                .returns( 'https://api.endpoints.product.dev.alertlogic.com' );
        getOrgStub = sinon.stub( endpointsClient, 'getAccountOrganizationFromAIMS' )
                .returns( Promise.resolve( organizationMock ) );
        apiBaseURL = AlLocatorService.resolveURL( AlLocation.InsightAPI );
        endpointsApiURL = AlLocatorService.resolveURL( AlLocation.EndpointsAPI );
        globalBaseURL = AlLocatorService.resolveURL( AlLocation.GlobalAPI );
    });
    afterEach(() => {
        requestStub.restore();
        getServiceEndpointsStub.restore();
        getOrgStub.restore();
        lookupDefaultServiceEndpointStub.restore();
    });
    describe('dereferencing an account to an organization', () => {
        it('should use the getAccountOrganizationFromAIMS method and cache results', async() => {
            let organization = await endpointsClient.getAccountOrganization( accountIdMock );
            expect( organization ).to.equal( organizationMock );
            await endpointsClient.getAccountOrganization( accountIdMock );
            await endpointsClient.getAccountOrganization( accountIdMock );        //  second call should come from cache
            let organizationId = await endpointsClient.getAccountOrganizationId( accountIdMock );
            expect( getOrgStub.callCount ).to.equal( 1 );
            expect( getOrgStub.args[0][0] ).to.equal( accountIdMock );
            expect( organizationId ).to.equal( organizationIdMock );
        });
    });

    describe(".getAllAgentVersions()", () => {
        it("should produce a well formed request", async () => {
            await endpointsClient.getAllAgentVersions( accountIdMock );
            expect( requestStub.callCount ).to.equal( 1 );
            expect( requestStub.args[0][0].url ).to.equal( `${endpointsApiURL}/api/v1/organizations/${organizationIdMock}/all_agent_versions` );
        } );
    } );
    describe(".getMappingDictionary()", () => {
        it("should produce a well formed request", async () => {
            await endpointsClient.getMappingDictionary( accountIdMock );
            expect( requestStub.callCount ).to.equal( 1 );
            expect( requestStub.args[0][0].url ).to.equal( `${endpointsApiURL}/api/v1/mappings` );
        } );
    } );
    describe(".getIncidentGroups", () => {
        it("should produce a well formed request", async () => {
            await endpointsClient.getIncidentGroups( accountIdMock );
            expect( requestStub.callCount ).to.equal( 1 );
            expect( requestStub.args[0][0].url ).to.equal( `${endpointsApiURL}/api/v1/incidents/organization/${organizationIdMock}/grouped` );
        } );
    } );
    describe(".getEndpointDetails", () => {
        it("should produce a well formed request", async () => {
            await endpointsClient.getEndpointDetails( accountIdMock );
            expect( requestStub.callCount ).to.equal( 1 );
            expect( requestStub.args[0][0].url ).to.equal( `${endpointsApiURL}/api/v1/endpoints/organization/${organizationIdMock}` );
        } );
    } );
});
