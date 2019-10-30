import { CoralClient } from '../src/index';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = "aecoral";

afterEach(() => {
  sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('AECORAL CLIENT - Test Suite', () => {
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

  describe('When creating a notification-only correlation rule', () => { 
    beforeEach(() => {
      stub = sinon.stub(CoralClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s POST.', async () => {
      await CoralClient.createCorrelationRule('2',testReq);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('When fetching incident specifications', () => {
    beforeEach(() => {
      stub = sinon.stub(CoralClient['alClient'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('Should call the ALClient instance\'s FETCH.', async () => {
      await CoralClient.getIncidentSpecifications('2');
      expect(stub.callCount).to.equal(1);
    });
  });
});
