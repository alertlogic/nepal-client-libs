import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { TMClient } from '../src/index';

const serviceName = 'ticketmaster';
const accountId = '12345';
const userId = '4567';
const queryParams = { foo: 'bar' };

afterEach(() => {
    sinon.restore();
});
describe('Ticket Master Client Test Suite:', () => {
    describe('when creating an agent ticket', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'post');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call post() on the ALClient instance', async () => {
            const id = '1234';
            const subject = 'My Subject';
            const description = 'Testing Creation';
            const assigneeId = '4321';
            const endCustomer = '7890';
            const problemSummary = 'A make believe problem';
            const sensorName = 'invisible';
            const sensorId = '0987';
            const heimdallAccount = '12345676890';
            const feature = 'none';
            const priority = 'high';
            const impact = 'critical';
            const breach = 'no';
            const urgency = 'none';
            const kbaStatus = 'none';
            const category = 'pretend';
            const resolutionCall = 'https://www.alertlgic.com';
            const issueType = 'pretend';
            const experience = 'unknown';
            const securityClearance = 'top secret';
            const origin = 'test suite';
            const product = 'siemless';
            const mainProduct = 'siemless';
            await TMClient.createAgentTicket(
                id,
                subject,
                description,
                assigneeId,
                endCustomer,
                problemSummary,
                sensorName,
                sensorId,
                heimdallAccount,
                feature,
                priority,
                impact,
                breach,
                urgency,
                kbaStatus,
                category,
                resolutionCall,
                issueType,
                experience,
                securityClearance,
                origin,
                product,
                mainProduct,
            );
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when creating a ticket', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'post');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call post() on the ALClient instance', async () => {
            const accountId = '1234';
            const subject = 'My Subject';
            const comment = 'A Comment';
            const partnerTicketId = '7890';
            await TMClient.createTicket(accountId, subject, comment, partnerTicketId);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when getting a ticket', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the ALClient instance', async () => {
            const accountId = '1234';
            const ticketId = '7890';
            await TMClient.getTicket(accountId, ticketId);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when getting a list of ticket comments', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the ALClient instance', async () => {
            const accountId = '1234';
            const ticketId = '7890';
            const queryParams = { next_page: '1', since: '1234', sort_by: 'abc', sort_order: 'desc' };
            await TMClient.getTicketComments(accountId, ticketId, queryParams);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when getting a list of tickets', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'get');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call get() on the ALClient instance', async () => {
            const accountId = '1234';
            const queryParams = { next_page: '1', status: '1234', sort_by: 'abc', sort_order: 'desc' };
            await TMClient.getTickets(accountId, queryParams);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when updating a ticket', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'put');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call put() on the ALClient instance', async () => {
            const accountId = '1234';
            const ticketId = '7890';
            const comment = 'This is a comment';
            const partnerTicketId = '5678';
            await TMClient.updateTicket(accountId, ticketId, comment, partnerTicketId);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when registering a callback', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'post');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call post() on the ALClient instance', async () => {
            const accountId = '1234';
            const url = 'https://www.alertlogic.com';
            await TMClient.registerCallback(accountId, url);
            expect(stub.callCount).to.equal(1);
        });
    });
    describe('when registering kineses', () => {
        let stub: sinon.SinonSpy;
        beforeEach(() => {
            stub = sinon.stub(TMClient['client'], 'post');
        });
        afterEach(() => {
            stub.restore();
        });
        it('should call post() on the ALClient instance', async () => {
            const accountId = '1234';
            const streamName = 'My Stream';
            const tributaryId = '7890';
            await TMClient.registerKinesis(accountId, streamName, tributaryId);
            expect(stub.callCount).to.equal(1);
        });
    });

});
