import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlSchedulerClient } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "production" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('SCAN SCHEDULER CLIENT', () => {
    const scheduleExample = {
        type: "testType",
        name: "Test Scan Schedule",
        active: true,
        default: true
    };
    const schedules = [scheduleExample];

    describe('When creating scan schedule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { schedule_rule_id: "12345678" }}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s POST.', async () => {
            await AlSchedulerClient.createSchedule('2', scheduleExample);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules");
        });
    });
    describe('When removing a scan schedule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s DELETE.', async () => {
            await AlSchedulerClient.removeSchedule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules/12345678");
        });
    });
    describe('When fetching a particular scan schedule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: scheduleExample}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s GET.', async () => {
            await AlSchedulerClient.getSchedule('2', '12345678');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules/12345678");
        });
    });
    describe('When fetching all scan schedules', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: schedules}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s GET.', async () => {
            await AlSchedulerClient.getAllSchedules('2');
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules");
        });
    });
    describe('When updating a scan schedule', () => {
        beforeEach(() => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {schedule_rule_id: "12345678"}}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlDefaultClient instance\'s PUT.', async () => {
            await AlSchedulerClient.updateSchedule('2', '12345678', scheduleExample);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/scheduler/v1/2/schedules/12345678");
        });
    });
});
