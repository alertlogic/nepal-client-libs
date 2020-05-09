
import {
    AlDefaultClient,
    AlLocatorService,
  } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlTicketMasterClient } from '../src/index';

beforeEach(() => {
    AlLocatorService.setContext( { environment: "production" } );
    AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('Ticket Master client', () => {
    const apiBaseURL = "https://api.cloudinsight.alertlogic.com";
    const service = "ticketmaster";
    const version = "v1";
    const accountId = "345";
    const ticket = {ticket: 'qwert'};

    describe('When delete subscriptions is called', () => {

        it('Should call the Ticket Master instance\'s POST.', async () => {
            stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: ticket}));
            await AlTicketMasterClient.getTicket(accountId);
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal(`${apiBaseURL}/${service}/${version}/${accountId}/ticket`);
        });
    });

});
