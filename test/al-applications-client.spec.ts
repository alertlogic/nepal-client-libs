import { AlApplicationsClient, AlApplication } from '../src/index';
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

describe('APPLICATION CLIENT', () => {
    const apiBaseURL = "https://api.cloudinsight.alertlogic.com";
    const service = "applications";
    const version = "v1";

    const applicationListMock = [
        {
            "name": "Linux System Log",
            "modified": {
                "by": "system",
                "at": 1573732360
            },
            "id": "1",
            "created": {
                "by": "system",
                "at": 1573732360
            },
            "config": {
                "syslog": {
                    "disk_limit": 500,
                    "disk_cache_size": 10,
                    "container_logs_enabled": true,
                    "agent_port": 1514
                }
            }
        },
        {
            "name": "Windows Event Log",
            "modified": {
                "by": "system",
                "at": 1573732360
            },
            "id": "2",
            "created": {
                "by": "system",
                "at": 1573732360
            },
            "config": {
                "eventlog": {
                    "streams": [],
                    "log_api_request_size": 512,
                    "collect_from_discovered_streams": true
                }
            }
        },
        {
            "name": "IIS",
            "modified": {
                "by": "system",
                "at": 1573732360
            },
            "id": "3",
            "created": {
                "by": "system",
                "at": 1573732360
            },
            "config": {
                "flatfile": {
                    "message_timestamp": {
                        "type": "automatic"
                    },
                    "message_split_spec": {
                        "type": "single_line"
                    },
                    "filename": {
                        "type": "automatic",
                        "pattern": "*.log"
                    }
                }
            }
        }
    ];

    describe('List ', () => {
        describe('When getting application list', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: applicationListMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlHeraldClient instance\'s GET.', async () => {
                const accountId = "2";
                const result =  await AlApplicationsClient.getAllApplication(accountId);
                const payload = stub.args[0][0];

                expect( stub.callCount ).to.equal(1);
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/applications`);
                expect( result ).to.equal( applicationListMock );
                expect( result.length ).to.equal( 3 );
                expect( result[0].config.syslog ).not.to.equal(undefined);
                expect( result[1].config.eventlog ).not.to.equal(undefined);
                expect( result[2].config.flatfile ).not.to.equal(undefined);
            });
        });
    });
} );
