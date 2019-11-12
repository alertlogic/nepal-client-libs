import { AlHeraldClient } from '../src/index';
import { ALClient } from '@al/client';
import { expect } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

beforeEach(() => {
    ALClient.setGlobalParameters( { noEndpointsResolution: true } );
} );

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe('HERALD CLIENT', () => {
    const subscriptionkeysMock = {
        "subscription_keys":[
           {
              "subkey":"feature/primary",
              "name":"Primary Feature",
              "modified":{
                 "by":"EA0F10DF-572B-40D6-B467-6C0AA86741DD",
                 "at":1559834538
              },
              "feature":"feature",
              "created":{
                 "by":"8C8177B4-4542-427C-A4D1-0EE4672A223F",
                 "at":1528221409
              }
           },
           {
              "subkey":"feature2/secondary",
              "name":"Secondary Feature 2",
              "modified":{
                 "by":"EA9F00DF-573B-40D6-B567-6C0AA87645DD",
                 "at":1559834539
              },
              "feature":"feature2",
              "created":{
                 "by":"8C9177B4-4542-427C-A4D1-1EE4672A307F",
                 "at":1528221453
              }
           }
        ]
    };

    describe('When fetching all subscription keys', () => {
        beforeEach(() => {
            stub = sinon.stub(ALClient as any, 'axiosRequest').returns(Promise.resolve({status: 200, data: subscriptionkeysMock}));
        });
        afterEach(() => {
            stub.restore();
        });
        it('Should call the AlHeraldClient instance\'s GET.', async () => {
            await AlHeraldClient.getAllSubscriptionKeys();
            expect(stub.callCount).to.equal(1);
            expect(stub.args[0][0].url).to.equal("https://api.cloudinsight.alertlogic.com/herald/v1/subscription_keys");
        });
    });
});
