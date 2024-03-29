import {
    AlDefaultClient,
    AlLocatorService
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlResponderAction,
    AlResponderClient,
    AlResponderExecution,
    AlResponderInquiries,
    AlResponderInquiry,
    AlResponderMRGeneric,
    AlResponderMRPaloAltoBlock,
    AlResponderPlaybook,
    AlResponderPlaybooks,
    AlResponderRoles,
    AlResponderSchedule
} from '../src/index';

beforeEach(() => {
    AlLocatorService.setContext({ environment: "production" });
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('Responder Client', () => {
    const apiBaseURL = "https://responder.mdr.global.alertlogic.com";
    const version = "v1";
    const accountId = "2";
    const playbookId = "abc";
    const executionId = "123456";
    const playbooksMock: AlResponderPlaybook[] = [
        {
            "id": "string",
            "name": "string",
            "description": "string",
            "type": "incident",
            "enabled": true,
            "tags": [
                {
                    "key": "string",
                    "value": "string"
                }
            ],
            "parameters": {},
            "output_schema": {},
            "workflow": {}
        }
    ];
    const playbookListMock: AlResponderPlaybooks = {
        playbooks: playbooksMock,
        marker: '233'
    };
    const inquiryMock: AlResponderInquiry = {
        id: 'belen',
        status: 'pending',
        type: "email"
    };
    const inquiriesMock: AlResponderInquiries = {
        executions: [inquiryMock],
        count: 1,
        marker: "",
        summary: {}
    };
    const executionMock: AlResponderExecution = {
        "id": "string",
        "modified": {
            "at": 0,
            "by": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        },
        "created": {
            "at": 0,
            "by": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        },
        "playbook_id": "string",
        "status": "running",
        "type": "incident",
        "account_id": "string"
    };
    const actions: AlResponderAction[] = [
        {
            action: {
                description: "Start playbook or an action execution",
                id: "5fd7d58fe67cde5f53ef110f",
                name: "create_execution",
                pack: "al_core",
                ref: "al_core.create_execution"
            }
        }
    ];
    const schedules: AlResponderSchedule[] = [
        {
            "name": "string",
            "description": "string",
            "ref": "string",
            "parameters": {
                "additionalProp1": {}
            },
            "schedule": {
                "timezone": "string",
                "year": 0,
                "month": 0,
                "day": 0,
                "week": 0,
                "day_of_week": 0,
                "hour": 0,
                "minute": 0,
                "second": 0,
                "type": "cron"
            },
            "enabled": true
        }
    ];
    const playbookRolesMock: AlResponderRoles = {
        allowed_values:{
            role_ids:[
                {label:"A", value:"B"},
                {label:"D", value:"C"}
            ]
        }
    };
    const mrConfigList: AlResponderMRGeneric[] = [];
    const mrConfigItem: AlResponderMRPaloAltoBlock = {
        type: "paloalto_block",
        name: "palo_alto",
        tag: "Palo alto tag"
    };
    const mrConfigId = '123';

    describe('Playbook', () => {
        describe('When get playbook', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: playbookListMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getPlaybooks(accountId,{});
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/playbooks`);
                expect(result).to.equal(playbookListMock);
            });
        });

        describe('When get all playbooks even deleted', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: playbookListMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getPlaybooks(accountId,{deleted:true});
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/playbooks`);
                expect(result).to.equal(playbookListMock);
            });
        });

        describe('When delete playbook by id is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns({ status: 204 });
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s DELETE.', async () => {
                await AlResponderClient.deletePlaybookById(accountId, playbookId);
                expect(stub.callCount).to.equal(1);
                expect(stub.args[0][0].url).to.equal(`${apiBaseURL}/${version}/${accountId}/playbooks/${playbookId}`);
            });
        });

        describe('When update playbook is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: playbooksMock[0] }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s PUT.', async () => {
                await AlResponderClient.updatePlaybook(accountId, playbookId, playbooksMock[0]);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("PUT");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/playbooks/${playbookId}`);
            });
        });
    });

    describe('Actions', () => {
        describe('When get actions', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: actions }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getActions(accountId, { payload_type: "incident" });
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/actions`);
                expect(result).to.equal(actions);
            });
        });
    });

    describe('Executions actions', () => {
        describe('When re-run is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: executionMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                const result = await AlResponderClient.reRunExecution(accountId, executionId, { delay: 30 });
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("POST");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/executions/${executionId}/re_run`);
                expect(result).to.equal(executionMock);
            });
        });

        describe('When paused is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                await AlResponderClient.pauseExecution(accountId, executionId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("POST");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/executions/${executionId}/pause`);
            });
        });

        describe('When resume is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                await AlResponderClient.resumeExecution(accountId, executionId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("POST");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/executions/${executionId}/resume`);
            });
        });
    });
    describe('Inquiries', () => {
        describe('When get inquiries', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: inquiriesMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getInquiries(accountId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/inquiries`);
                expect(result).to.equal(inquiriesMock);
            });
        });

        describe('When get inquiry', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: inquiryMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const inquiryId = "someid";
                const result = await AlResponderClient.getInquiry(accountId, inquiryId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/inquiries/${inquiryId}`);
                expect(result).to.equal(inquiryMock);
            });
        });
    });

    describe('Schedules', () => {
        const scheduleId = "123";

        describe('When get schedules', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: schedules }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getSchedules(accountId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/schedules`);
                expect(result).to.equal(schedules);
            });
        });

        describe('When get schedule by id', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: schedules[0] }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getScheduleById(accountId, scheduleId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/schedules/${scheduleId}`);
                expect(result).to.equal(schedules[0]);
            });
        });

        describe('When delete schedule by id is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns({ status: 204 });
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s DELETE.', async () => {
                await AlResponderClient.deleteScheduleById(accountId, scheduleId);
                expect(stub.callCount).to.equal(1);
                expect(stub.args[0][0].url).to.equal(`${apiBaseURL}/${version}/${accountId}/schedules/${scheduleId}`);
            });
        });

        describe('When update schedule is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: schedules[0] }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s PUT.', async () => {
                await AlResponderClient.updateSchedule(accountId, scheduleId, schedules[0]);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("PUT");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/schedules/${scheduleId}`);
            });
        });
    });


    describe('Playbook Roles', () => {
        describe('When get playbook roles', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: playbookRolesMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getPlaybookRoles(accountId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/playbook_roles`);
                expect(result).to.equal(playbookRolesMock);
            });
        });
    });

    describe('MR config', () => {
        describe('When get MR config list', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: mrConfigList }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getMRConfigList(accountId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/mr_configs`);
                expect(result).to.equal(mrConfigList);
            });
        });

        describe('When get MR config by id', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: mrConfigList[0] }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getMRConfigItemById(accountId, mrConfigId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/mr_configs/${mrConfigId}`);
                expect(result).to.equal(mrConfigList[0]);
            });
        });

        describe('When create MR config is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 201 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                await AlResponderClient.createMRConfigItem(accountId, mrConfigItem);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("POST");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/mr_configs`);
            });
        });

        describe('When update MR config is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s PUT.', async () => {
                await AlResponderClient.updateMRConfigItem(accountId, mrConfigId, mrConfigItem);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("PUT");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/mr_configs/${mrConfigId}`);
            });
        });

        describe('When delete MR config is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s DELETE.', async () => {
                await AlResponderClient.deleteMRConfigItem(accountId, mrConfigId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("DELETE");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/mr_configs/${mrConfigId}`);
            });
        });

        describe('When get MR config definitions', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: [] }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getMRConfigDefinitions(accountId);
                const payload = stub.args[0][0];
                expect(stub.callCount).to.equal(1);
                expect(payload.method).to.equal("GET");
                expect(payload.url).to.equal(`${apiBaseURL}/${version}/${accountId}/definitions/mr_configs`);
                expect(result).to.deep.eq([]);
            });
        });
    });
});
