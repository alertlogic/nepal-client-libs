import { AlDefaultClient } from '@al/core';
import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
    AlASIClient, Signup
} from '../src/index';


beforeEach(() => {
    AlDefaultClient.setGlobalParameters({ noEndpointsResolution: true });
});

afterEach(() => {
    sinon.restore();
});

// Global spy.
let stub: sinon.SinonSpy;

describe("ASI Configuration Client", () => {
    const service = "asi";
    const version = "v1";
    let request = {
        aws_marketplace_token: 'TOKEN',
        first_name: 'Benito',
        last_name: '',
        email: 'camelas@gmail.com',
        account_name: 'Cali Viejo', 
        contact_phone: '555-5555',
        primary_title: 'Reina de Reinas',
        primary_first_name: 'Jovita',
        primary_last_name: 'Feijoo',
        primary_email: 'Feijoo@Cal',
        primary_contact_phone: '',
        primary_contact_mobile: '',
    } as Signup;

    describe("WHEN signup is called", () => {
        beforeEach(() => {
            stub = sinon
                    .stub(AlDefaultClient as any, 'axiosRequest')
                    .returns(Promise.resolve({status: 200, data: {}}));
        });

        afterEach(() => {
            stub.restore();
        });

        it('Should call the AlASIClient instance\'s POST.', async () => {
            const productType = 'cd';
            await AlASIClient
                                    .signupMRRProduct('cd', request);
            const rawPayload = stub.args[0][0];
            expect( stub.callCount ).to.equal(1);
            expect( rawPayload.method ).to.equal( "POST" );
            expect( rawPayload.url ).to.contain(`/registration/signup/mrr/${productType}`);
        });
    });
});
