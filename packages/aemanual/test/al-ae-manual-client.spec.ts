import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlAeManualClient, AlManualRequest } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "production" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

xdescribe('SCAN SCHEDULER CLIENT', () => {
    const observableMock: AlManualRequest = {
        "customer_id": 134264762,
        "summary": "Test manual incident AE 2",
        "description": "REE incident manual creationdescription",
        "classification": "test",
        "time_frame": 60,
        "datacenter": "Acheron",
        "facts": [
            {"message": [
                {
                    "id": "QU1JNAgAt7oAAAAAX0z4jl9M+boAAm8JIAMAHmFwcGxpY2F0aW9uL3gtYWxwYWNrZXQtbG9nbXNncwAGTE9HTVNH",
                    "type": "application/x-alpacket-logmsgs"
                }
            ]}
        ],
        "correlation": [],
        "sources": ["MANL"],
        "keyedon_value": "sqli",
        "gen_type": "manual",
        "threat_rating": "Medium"
    };

    describe('When creating scan schedule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { schedule_rule_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s POST.', async () => {
            await AlAeManualClient.create('2', observableMock);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules");
        });
    });
});
