import { AlApplicationsClient, AlRulePayload } from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

beforeEach(() => {
    ALClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('APPLICATION CLIENT', () => {
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

    const rulesListMock = [
        {
            version: 2,
            scope: [
                {
                    value: 'IIS',
                    type: 'tag',
                    name: 'Application'
                }
            ],
            modified: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573734506
            },
            id: 'BD30F3F3-5D12-421A-B806-C65155C40CE1',
            created: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573734227
            },
            config: {
                flatfile: {
                    path: 'C:\\inetpub\\logs\\LogFiles\\*',
                    message_timestamp: {
                        type: 'automatic'
                    },
                    message_split_spec: {
                        type: 'single_line'
                    },
                    filename: {
                        type: 'automatic',
                        pattern: '*.log'
                    }
                }
            },
            application_id: '3',
            account_id: '2'
        },
        {
            version: 1,
            scope: [],
            modified: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573733352
            },
            id: 'E78E4878-A96E-48BD-A27B-0EE56BEA1FE4',
            created: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573733352
            },
            config: {
                syslog: {
                    disk_limit: 500,
                    disk_cache_size: 10,
                    container_logs_enabled: true,
                    agent_port: 1514
                }
            },
            application_id: '1',
            account_id: '2'
        }
    ];

    const rulesListByDeploymentMock = [
        {
            version: 2,
            scope: [
                {
                    value: 'IIS',
                    type: 'tag',
                    name: 'Application'
                }
            ],
            modified: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573734506
            },
            id: 'BD30F3F3-5D12-421A-B806-C65155C40CE1',
            created: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573734227
            },
            config: {
                flatfile: {
                    path: 'C:\\inetpub\\logs\\LogFiles\\*',
                    message_timestamp: {
                        type: 'automatic'
                    },
                    message_split_spec: {
                        type: 'single_line'
                    },
                    filename: {
                        type: 'automatic',
                        pattern: '*.log'
                    }
                }
            },
            application_id: '3',
            account_id: '2'
        },
        {
            version: 1,
            scope: [],
            modified: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573733352
            },
            id: 'E78E4878-A96E-48BD-A27B-0EE56BEA1FE4',
            created: {
                by: '1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182',
                at: 1573733352
            },
            config: {
                syslog: {
                    disk_limit: 500,
                    disk_cache_size: 10,
                    container_logs_enabled: true,
                    agent_port: 1514
                }
            },
            application_id: '1',
            account_id: '2'
        }
    ];
    const ruleMock = {
        "version": 1,
        "scope": [
            {
                "value": "IIS",
                "type": "tag",
                "name": "Application"
            }
        ],
        "modified": {
            "by": "1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182",
            "at": 1573734227
        },
        "id": "BD30F3F3-5D12-421A-B806-C65155C40CE1",
        "deployment_id": "AD30F3F3-5D12-421A-B806-C65155C40CE2",
        "created": {
            "by": "1443C74F-2AF7-4D7F-BF4A-FDFFE9C67182",
            "at": 1573734227
        },
        "config": {
            "flatfile": {
                "path": "C:\\inetpub\\logs\\LogFiles\\W3SVC777",
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
        },
        "application_id": "3",
        "search_by": [
            {
                "key1": "value1"
            },
            {
                "key2": "value2"
            }
        ]
    };

    describe('List ', () => {
        describe('When getting application list', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: applicationListMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationClient instance\'s GET to get the aplications.', async () => {
                const accountId = "2";
                const result = await AlApplicationsClient.getAllApplications(accountId);
                const payload = stub.args[0][0];

                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.contain(`/${service}/${version}/${accountId}/applications`);
                expect(result).to.equal(applicationListMock);
                expect(result.length).to.equal(3);
                expect(result[0].config.syslog).not.to.equal(undefined);
                expect(result[1].config.eventlog).not.to.equal(undefined);
                expect(result[2].config.flatfile).not.to.equal(undefined);
            });
        });

        describe('When getting rules list', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: rulesListMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationClient instance\'s GET to get the rules.', async () => {
                const accountId = "2";
                const result = await AlApplicationsClient.getAllRules(accountId);
                const payload = stub.args[0][0];

                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.contain(`/${service}/${version}/${accountId}/rules`);
                expect(result).to.equal(rulesListMock);
                expect(result.length).to.equal(2);
                expect(result[0].config.flatfile).not.to.equal(undefined);
                expect(result[1].config.syslog).not.to.equal(undefined);
            });
        });

        describe('When getting rules list by deployment', () => {
            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: rulesListByDeploymentMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationClient instance\'s GET the rules by deployment.', async () => {
                const accountId = "2";
                const result = await AlApplicationsClient.getAllRulesByDeployment(accountId, '1234567890');
                const payload = stub.args[0][0];

                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.contain(`/${service}/${version}/${accountId}/deployments/1234567890/rules`);
                expect(result).to.equal(rulesListByDeploymentMock);
                expect(result.length).to.equal(2);
                expect(result[0].config.flatfile).not.to.equal(undefined);
                expect(result[1].config.syslog).not.to.equal(undefined);
            });
        });
    });

    describe('Rules ', () => {
        describe('When Add rule', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: ruleMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationsClient instance\'s POST.', async () => {
                const accountId = "2";
                const deploymentId = "7D5E66BE-98C6-40A2-8B09-5DC4C0FEE677";
                const dataPayload = { "application_id": "3", "config": {"flatfile": {"path": "C:\\inetpub\\logs\\LogFiles\\W3SVC777"}}, "scope": [{"type": "tag", "name": "Application", "value": "IIS"}] } as AlRulePayload;
                const result =  await AlApplicationsClient.addRule(accountId, dataPayload, deploymentId);
                const payload = stub.args[0][0];

                expect( stub.callCount ).to.equal(1);
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.contain(`/${service}/${version}/${accountId}/deployments/${deploymentId}/rules`);
                expect( result ).to.equal( ruleMock );
                expect( result.application_id ).to.equal('3');
                expect( result.config.flatfile ).not.to.equal(undefined);
                expect( result.config.flatfile.path ).to.equal(dataPayload.config.flatfile.path);
            });
        });

        describe('When modify a rule', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: ruleMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationsClient instance\'s PUT.', async () => {
                const accountId = "2";
                const ruleId = "BD30F3F3-5D12-421A-B806-C65155C40CE1";
                const dataPayload = { "application_id": "3", "config": {"flatfile": {"path": "C:\\inetpub\\logs\\LogFiles\\W3SVC777"}}, "scope": [{"type": "tag", "name": "Application", "value": "IIS"}] } as AlRulePayload;
                const result =  await AlApplicationsClient.updateRule(accountId, ruleId, dataPayload);
                const payload = stub.args[0][0];

                expect( stub.callCount ).to.equal(1);
                expect( payload.method ).to.equal( "PUT" );
                expect( payload.url ).to.contain(`/${service}/${version}/${accountId}/rules/${ruleId}`);
                expect( result ).to.equal( ruleMock );
                expect( result.application_id ).to.equal('3');
                expect( result.config.flatfile ).not.to.equal(undefined);
                expect( result.config.flatfile.path ).to.equal(dataPayload.config.flatfile.path);
            });
        });

        describe('When delete a rule', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationsClient instance\'s DELETE.', async () => {
                const accountId = "2";
                const ruleId = "BD30F3F3-5D12-421A-B806-C65155C40CE1";
                const result =  await AlApplicationsClient.deleteRule(accountId, ruleId);
                const payload = stub.args[0][0];

                expect( stub.callCount ).to.equal(1);
                expect( payload.method ).to.equal( "DELETE" );
                expect( payload.url ).to.contain(`/${service}/${version}/${accountId}/rules/${ruleId}`);
            });
        });

        describe('When get rule', () => {

            beforeEach(() => {
                stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: ruleMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the AlApplicationsClient instance\'s GET.', async () => {
                const accountId = "2";
                const ruleId = "0C51E404-4BB4-4228-B6B7-32B43029C76F";
                const result =  await AlApplicationsClient.getRule(accountId, ruleId);
                const payload = stub.args[0][0];

                expect( stub.callCount ).to.equal(1);
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.contain(`/${ service }/${ version }/${ accountId }/rules/${ ruleId }`);
                expect( result ).to.equal( ruleMock );
                expect( result.application_id ).to.equal('3');
                expect( result.config.flatfile ).not.to.equal(undefined);
            });
        });
    });
});
