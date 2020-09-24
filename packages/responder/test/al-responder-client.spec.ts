import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlResponderPlaybook, AlResponderClient } from '../src/index';

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
});
