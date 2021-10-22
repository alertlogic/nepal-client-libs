import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlExclusionsClient, ExclusionsRulesDescriptor
} from '../src/index';


beforeEach(() => {
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe("Exclusions Client", () => {

    describe("WHEN getting an exclusion rule", () => {

        const exclusionRuleRaw = {
            "id": "6d71851b-b5b1-4815-8d23-36eb29df9623",
            "name": "my exclusions rule",
            "description": "dont scan during weekdays and on Christmas Eve ",
            "enabled": "true",
            "features": ["scan", "ids"],
            "blackouts": [{
                    "resolution": "weekly",
                    "day_of_week": [1, 2, 3, 4, 5],
                    "start_time": "09:00",
                    "end_time": "16:59"
                },
                {
                    "resolution": "exact_date",
                    "date": "2018-12-24",
                    "start_time": "00:00",
                    "end_time": "23:59"
                }
            ],
            "assets": [{
                    "type": "cidr",
                    "value": "10.0.0.0/16"
                },
                {
                    "type": "asset",
                    "asset_type": "host",
                    "key": "/aws/us-east-1/host/i-1234567890"
                },
                {
                    "type": "tag",
                    "key": "MyTagName",
                    "value": "MyTagValue"
                }
            ],
            "details": [{
                "feature": "scan",
                "scan_type": "vulnerability",
                "ports": [80, 443, "1:1024"]
            }]
        };

        const deploymentId: string = "AAAA-BBBB-CCCC-DDDD";
        const ruleId: string = "1111-2222-3333-4444";
        const accountId: string = "123456789"
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: ExclusionsRulesDescriptor.import(exclusionRuleRaw)}));
        });
        afterEach(() => {
            stub.restore();
        });

        it("SHOULD issue a GET request and call the correct endpoint", async() => {
            const result = await AlExclusionsClient.getRule(accountId, deploymentId, ruleId);
            const stubResponse = stub.args[0][0];
            expect( stub.callCount ).to.equal(1);
            expect( stubResponse.method ).to.equal( "GET" );
            expect( stubResponse.url ).to.contain(`/${deploymentId}/rules/${ruleId}`);
        })
    })
  
});