import { AlCoralClient } from '../src/index';
import { AlLocatorService, AlLocation } from '@al/common';
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

describe('AECORAL CLIENT', () => {
    const testReq = {
        enabled: true,
        expression: "SELECT parsed.rule_id, parsed.json.event_name as event, parsed.json.userIdentity.userName AS username, parsed.json.userIdentity.accountId AS account, parsed.json.awsRegion as region FROM logmsgs WHERE time_recv BETWEEN 1451606400 AND 1451609400 AND parsed.rule_id = '808DDACC-8310-4AE9-BFA7-BFB66E18275E'",
        name: "'Simple' correlation",
        attacker_field: null,
        victim_field: "username",
        expression_window: "none",
        incident: {
            visibility: "notification",
            classification: "policy",
            severity: "low",
            summary: "Very Valuable demo",
            description: "Some *markdown* text maybe..."
        }
    };
    const correlation_example = {
        attacker_field: null,
        enabled: true,
        expression: "SELECT INTERVAL(time_recv, 300) AS interval, parsed.json.eventName AS event, parsed.json.userIdentity.accountId AS account, parsed.json.awsRegion AS region, COUNT(message) AS count FROM logmsgs GROUP BY interval, event, account, region WHERE time_recv BETWEEN 1451606400 AND 1451609400 AND parsed.rule_id = '808DDACC-8310-4AE9-BFA7-BFB66E18275E' HAVING count >= 5",
        expression_window: "window",
        name: "Admin Failed Login 3",
        victim_field: "account"
    };
    const correlations = [correlation_example];

    describe('When creating a notification-only correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { correlation_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s POST.', async () => {
            await AlCoralClient.createCorrelationRule('2',testReq);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations");
        });
    });
    describe('When fetching incident specifications', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { correlation_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s FETCH.', async () => {
            await AlCoralClient.getIncidentSpecifications();
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/incident_spec");
        });
    });
    describe('When removing a correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s DELETE.', async () => {
            await AlCoralClient.removeCorrelationRule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
    describe('When fetching a particular correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: correlation_example}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s GET.', async () => {
            await AlCoralClient.getCorrelationRule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
    describe('When fetching all correlation rules', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: correlations}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s GET.', async () => {
            await AlCoralClient.getAllCorrelations('2');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations");
        });
    });
    describe('When updating a correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {correlation_id: "12345678"}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the ALClient instance\'s PUT.', async () => {
            await AlCoralClient.updateCorrelationRule('2', '12345678', correlation_example);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
});
