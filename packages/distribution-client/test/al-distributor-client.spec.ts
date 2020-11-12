import {
  AlDefaultClient,
  AlLocatorService,
} from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

import { AlDistributorClient } from '../src/index';

beforeEach(() => {
  AlLocatorService.setContext( { environment: "integration" } );
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('Distributor Client', () => {
    const apiBaseURL = "https://distributor.mdr.product.dev.alertlogic.com";
    const version = "v1";
    const accountId = "2";

    describe('Playbook', () => {
        describe('When get playbbok', () => {
            beforeEach(() => {
                stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: {}}));
            });
            afterEach(() => {
                stub.restore();
            });
            it('Should call the client instance\'s GET.', async () => {
                const result = await AlDistributorClient.downloadFirewallRules(accountId, 'content/aws/network-firewall/Cloud-Defender-minimal.json.zip');
                const payload = stub.args[0][0];
                expect( stub.callCount ).to.equal( 1 );
                expect( payload.method ).to.equal( "GET" );
                expect( payload.url ).to.equal( `${apiBaseURL}/${version}/${accountId}/content/aws/network-firewall/Cloud-Defender-minimal.json.zip`);
            });
        });
    });
});
