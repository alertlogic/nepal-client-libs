import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlCoralClient } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "production" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
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
    const correlationExample = {
        attacker_field: null,
        enabled: true,
        expression: "SELECT INTERVAL(time_recv, 300) AS interval, parsed.json.eventName AS event, parsed.json.userIdentity.accountId AS account, parsed.json.awsRegion AS region, COUNT(message) AS count FROM logmsgs GROUP BY interval, event, account, region WHERE time_recv BETWEEN 1451606400 AND 1451609400 AND parsed.rule_id = '808DDACC-8310-4AE9-BFA7-BFB66E18275E' HAVING count >= 5",
        expression_window: "window",
        name: "Admin Failed Login 3",
        victim_field: "account"
    };
    const correlations = [correlationExample];

    describe('When creating a notification-only correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { correlation_rule_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s POST.', async () => {
            await AlCoralClient.createCorrelationRule('2',testReq);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations");
        });
    });
    describe('When getting incident specifications', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { correlation_rule_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s FETCH.', async () => {
            await AlCoralClient.getIncidentSpecifications();
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/incident_spec");
        });
    });
    describe('When removing a correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s DELETE.', async () => {
            await AlCoralClient.removeCorrelationRule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
    describe('When getting a particular correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: correlationExample}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s GET.', async () => {
            await AlCoralClient.getCorrelationRule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
    describe('When getting all correlation rules', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: correlations}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s GET.', async () => {
            await AlCoralClient.getAllCorrelations('2');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations");
        });
    });
    describe('When updating a correlation rule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {correlation_rule_id: "12345678"}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s PUT.', async () => {
            await AlCoralClient.updateCorrelationRule('2', '12345678', correlationExample);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/aecoral/v1/2/correlations/12345678");
        });
    });
});
