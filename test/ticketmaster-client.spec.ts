import { TMClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

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
      stub = sinon.stub(TMClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      const id = '1234',
        subject ='My Subject',
        description = 'Testing Creation',
        assigneeId = '4321',
        endCustomer = '7890',
        problemSummary = 'A make believe problem',
        sensorName = 'invisible',
        sensorId = '0987',
        heimdallAccount = '12345676890',
        feature = 'none',
        priority = 'high',
        impact = 'critical',
        breach = 'no',
        urgency = 'none',
        kbaStatus = 'none',
        category = 'pretend',
        resolutionCall = 'https://www.alertlgic.com',
        issueType = 'pretend',
        experience = 'unknown',
        securityClearance = 'top secret',
        origin = 'test suite',
        product = 'siemless',
        mainProduct = 'siemless';
      await TMClient.createAgentTicket(id, subject, description, assigneeId, endCustomer, problemSummary, sensorName,
                                      sensorId, heimdallAccount, feature, priority, impact, breach, urgency,
                                      kbaStatus, category, resolutionCall, issueType, experience, securityClearance,
                                      origin, product, mainProduct);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when creating a ticket', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      const accountId = '1234',
          subject = 'My Subject',
          comment = 'A Comment',
          partnerTicketId = '7890';
      await TMClient.createTicket(accountId, subject, comment, partnerTicketId);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting a ticket', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      const accountId = '1234',
          ticketId = '7890';
      await TMClient.getTicket(accountId, ticketId);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting a list of ticket comments', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      const accountId = '1234',
          ticketId = '7890',
          queryParams = {next_page: '1', since: '1234', sort_by: 'abc', sort_order: 'desc'};
      await TMClient.getTicketComments(accountId, ticketId, queryParams);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when getting a list of tickets', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      const accountId = '1234',
          queryParams = {next_page: '1', status: '1234', sort_by: 'abc', sort_order: 'desc'};
      await TMClient.getTickets(accountId, queryParams);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when updating a ticket', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance', async() => {
      const accountId = '1234',
          ticketId = '7890',
          comment = 'This is a comment',
          partnerTicketId = '5678';
      await TMClient.updateTicket(accountId, ticketId, comment, partnerTicketId);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when registering a callback', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      const accountId = '1234',
          url = 'https://www.alertlogic.com';
      await TMClient.registerCallback(accountId, url);
      expect(stub.callCount).to.equal(1);
    });
  });
  describe('when registering kineses', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(TMClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance', async() => {
      const accountId = '1234',
      streamName = 'My Stream',
      tributaryId = '7890';
      await TMClient.registerKinesis(accountId, streamName, tributaryId);
      expect(stub.callCount).to.equal(1);
    });
  });
    
});
