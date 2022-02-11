import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlSercaClient
} from '../src/index';


beforeEach(() => {
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe("Serca Client", () => {

    describe("WHEN getting an serca search", () => {

        const sercaSearchRaw = {
            "search_result": {
                "total_found": 0,
                "status_details": "complete",
                "search_uuid": "BC34B231-3BF8-4EFF-BB38-8E254BF92FB6",
                "search_status": "complete",
                "search_start": 1644596886,
                "search_end": 1644600486,
                "results": {
                    "records": [],
                    "metadata": {
                        "interval_start": "interval_start",
                        "fields": "fields"
                    },
                    "columns": [
                        "fields",
                        "interval_start"
                    ]
                },
                "remaining": 0,
                "offset": 0,
                "external_details": "complete",
                "data_type": "rta",
                "account_id": "134249236"
            }
        };

        const query: string = "SELECT *FROM rta:logmsgs:EmailDashboard/TopRecipientsMaliciousEmail LIMIT 10";
        const accountId: string = "123456789"
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: sercaSearchRaw}));
        });
        afterEach(() => {
            stub.restore();
        });

        it("SHOULD issue a GET request and call the correct endpoint", async() => {
            const result = await AlSercaClient.search(accountId, query);
            const stubResponse = stub.args[0][0];
            expect( stub.callCount ).to.equal(1);
            expect( stubResponse.method ).to.equal( "POST" );
        })
    })
});