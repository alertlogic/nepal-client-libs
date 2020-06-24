import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlFimClient,
    AlFimConfiguration,
    getFullPath,
    AlFimConfigurationSummaryReport
} from '../src/index';


beforeEach(() => {
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe("FIM Configuration Client", () => {
    const service = "fim_config";
    const version = "v1";
    let payload = {
        id: "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF",
        version: 1,
        account_id: "12345678",
        deployment_id: "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
        type: "nix_dir",
        base: "/directory",
        pattern: "file",
        system: false,
        enabled: true,
        created: {
            by: "BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB",
            at: 1588323600,
            at_iso: "2020-05-01T09:00:00Z"
        }
    } as AlFimConfiguration;

    const rawFimConfig = {
        id: "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF",
        version: 1,
        account_id: "12345678",
        deployment_id: "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
        type: "nix_dir",
        base: "/directory"
    };

    const rawFimSummaryReport: AlFimConfigurationSummaryReport = {
        "monitored_paths": {
            "win_reg": {
                "total_num": 23,
                "num_enabled": 23
            },
            "win_dir": {
                "total_num": 9,
                "num_enabled": 9
            },
            "nix_dir": {
                "total_num": 10,
                "num_enabled": 10
            }
        },
        "excluded_paths": {
            "win_reg": {
                "total_num": 0,
                "num_enabled": 0
            },
            "win_dir": {
                "total_num": 0,
                "num_enabled": 0
            },
            "nix_dir": {
                "total_num": 0,
                "num_enabled": 0
            }
        }
    }

    describe("WHEN creating/updating fim_config object", () => {
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: payload}));
        });
        afterEach(() => {
            stub.restore();
        });
        it("SHOULD send a fim_config payload", () => {
            it('Should call the AlFimClient instance\'s POST.', async () => {
                const accountId = "12345678";
                const deploymentId = "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA";
                const result =  await AlFimClient
                                      .createConfiguration('excluded_paths',
                                                           accountId,
                                                           deploymentId,
                                                           payload);
                const rawPayload = stub.args[0][0];
                expect( stub.callCount ).to.equal(1);
                expect( rawPayload.method ).to.equal( "POST" );
                expect( rawPayload.url ).to.contain(`/deployments/${deploymentId}/excluded_paths`);
                expect( result ).to.equal( rawFimConfig );
            });
            it('Should call the AlFimClient instance\'s PUT.', async () => {
                const accountId = "12345678";
                const deploymentId = "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA";
                const configId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
                const result =  await AlFimClient
                                        .updateConfiguration('excluded_paths',
                                                             accountId,
                                                             deploymentId,
                                                             configId,
                                                             payload);
                const rawPayload = stub.args[0][0];
                expect( stub.callCount ).to.equal(1);
                expect( rawPayload.method ).to.equal( "PUT" );
                expect( rawPayload.url ).to.contain(`/deployments/${deploymentId}/excluded_paths/${configId}`);
                expect( result ).to.equal( rawFimConfig );
            });
        });
    });
    describe("WHEN deleting a fim config object", () => {
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 204}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlFimClient instance\'s DELETE.', async () => {
            const accountId = "12345678";
            const deploymentId = "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA";
            const configId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
            await AlFimClient
                .deleteConfiguration('excluded_paths',
                    accountId,
                    deploymentId,
                    configId);
            const rawPayload = stub.args[0][0];
            expect(stub.callCount).to.equal(1);
            expect(rawPayload.method).to.equal("DELETE");
            expect(rawPayload.url ).to.contain(`/deployments/${deploymentId}/excluded_paths/${configId}`);
        });
    });

    describe("WHEN fetching a fim config objet", () => {
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: rawFimConfig}));
        });
        afterEach(() => {
            stub.restore();
        });
        it("Should call the AlFimClient instance\'s GET.", async () => {
            const accountId = "12345678";
            const deploymentId = "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA";
            const configId = 'FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF';
            const result: AlFimConfiguration = await AlFimClient
                                .getConfiguration('excluded_paths',
                                                  accountId,
                                                  deploymentId,
                                                  configId);
            const rawPayload = stub.args[0][0];
            expect( stub.callCount ).to.equal(1);
            expect( rawPayload.method ).to.equal( "GET" );
            expect( rawPayload.url ).to.contain(`/deployments/${deploymentId}/excluded_paths/${configId}`);
            expect( result ).to.equal( rawFimConfig as AlFimConfiguration );
        });
    });


    describe("WHEN calculating the full path from the base and pattern properties of fim config object", () => {
        it("SHOULD work for nix and windows configurations", () => {
            const config = rawFimConfig as AlFimConfiguration;
            config.type = 'nix_dir';
            config.base = "/var/log/";
            config.pattern = "*.log";
            let actual: string = getFullPath(config);
            expect(actual).to.equal("/var/log/*.log");

            config.base = "/var/log";
            actual = getFullPath(config);
            expect(actual).to.equal("/var/log/*.log");

            config.type = 'win_dir';

            config.base = "c:\\path\\to\\logs\\";
            config.pattern = "*.log";
            actual = getFullPath(config);
            expect(actual).to.equal("c:\\path\\to\\logs\\*.log");

            config.base = "c:\\path\\to\\logs";
            actual = getFullPath(config);
            expect(actual).to.equal("c:\\path\\to\\logs\\*.log");

        });
    });

    describe("WHEN fetching a configurations summary report", ()=>{
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: rawFimSummaryReport}));
        });
        afterEach(() => {
            stub.restore();
        });

        it("Should call the AlFimClient instance\'s GET.", async () => {
            const accountId = "12345678";
            const result: AlFimConfigurationSummaryReport = await AlFimClient
                                .getConfigurationsSummary(accountId);
            const rawPayload = stub.args[0][0];
            expect( stub.callCount ).to.equal(1);
            expect( rawPayload.method ).to.equal( "GET" );
            expect( rawPayload.url ).to.contain('/reports/summary');
            expect( result ).to.equal( rawFimSummaryReport as AlFimConfigurationSummaryReport );
        });
    });
});
