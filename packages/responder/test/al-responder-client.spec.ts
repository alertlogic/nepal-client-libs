import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlResponderPlaybook, AlResponderClient, AlResponderInquiry, AlResponderInquiries, AlResponderExecution, AlResponderActionShort, AlResponderAction, AlResponderSchedule } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "production" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

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
    const inquiryMock: AlResponderInquiry = {
        id: 'belen',
        status: 'pending'
    };
    const inquiriesMock: AlResponderInquiries = {
        inquiries: [inquiryMock],
        count: 1,
        marker: ""
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
        "status": "new",
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

    describe('Playbook', () => {
        describe('When get playbbok', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: playbooksMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getPlaybooks(accountId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/playbooks` );
                expect( result ).to.equal( playbooksMock );
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
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: playbooksMock[0]}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s PUT.', async () => {
                await AlResponderClient.updatePlaybook(accountId, playbookId, playbooksMock[0]);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "PUT" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/playbooks/${playbookId}` );
            });
        });
    });

    describe('Actions', () => {
        describe('When get actions', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: actions }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getActions(accountId,{payload_type:"incident"});
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/actions` );
                expect( result ).to.equal( actions );
            });
        });
    });

    describe('Executions actions', () => {
        describe('When re-run is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: executionMock }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                const result = await AlResponderClient.reRunExecution(accountId, executionId, {delay:30});
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/executions/${executionId}/re_run` );
                expect( result ).to.equal( executionMock );
            });
        });

        describe('When paused is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                await AlResponderClient.pauseExecution(accountId, executionId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/executions/${executionId}/pause` );
            });
        });

        describe('When resume is called', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200 }));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s POST.', async () => {
                await AlResponderClient.resumeExecution(accountId, executionId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "POST" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/executions/${executionId}/resume` );
            });
        });
    });
    describe('Inquiries', () => {
        describe('When get inquiries', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: inquiriesMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getInquiries(accountId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/inquiries` );
                expect( result ).to.equal( inquiriesMock );
            });
        });

        describe('When get inquiry', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: inquiryMock}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const inquiryId = "someid";
                const result = await AlResponderClient.getInquiry(accountId, inquiryId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/inquiries/${inquiryId}` );
                expect( result ).to.equal( inquiryMock );
            });
        });
    });

    describe('Schedules', () => {
        describe('When get schedules', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: schedules}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlResponderClient.getSchedules(accountId);
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/schedules` );
                expect( result ).to.equal( schedules );
            });
        });
    });
});
