/*
 * File: evidence.class.spec.ts
 * Project: o3-incidents
 * File Created: Thursday, 13th December 2018 1:26:52 pm
 * Author: Daniel Felipe Garcia Cardenas (daniel.garcia@alertlogic.com)
 * -----
 * Last Modified: Thursday, 13th December 2018 6:05:04 pm
 * Modified By: Daniel Felipe Garcia Cardenas (daniel.garcia@alertlogic.com>)
 * -----
 * Copyright 2018 - 2018 Alert Logic Inc., Alert Logic Inc.
 */

import { expect } from 'chai';
import { describe } from 'mocha';
import { Elaboration } from "../src/types/elaboration.class";
import { Evidence } from "../src/types/evidence.class";

describe('Evidence', () => {

    class EvidenceClass extends Evidence { }
    let evidence:EvidenceClass;

    beforeEach(() => {

        evidence = new EvidenceClass();
    });

    describe('WHEN the class is initialized', () => {

        it('SHOULD have expected known properties and values', () => {

            expect(evidence.evidenceType).to.equal('unknown');
            expect(evidence.time).to.eql(new Date(0));
            expect(evidence.notes).to.equal(undefined);
        });
    });


    describe('WHEN getNestedProperty() is called', () => {

        it('SHOULD return undefined for the given property', () => {

            const response = (evidence as any).protocol_decodes;
            expect(response).to.equal(undefined);
        });

        it('SHOULD return an empty array for the given property with a call from a child of Evidence abstract class', () => {

            const elaboration:Elaboration = new Elaboration();
            const response = elaboration.protocol_decodes;
            expect(response).to.eql([]);
        });
    });

    describe('WHEN wsmSplitData() is called', () => {

        it('SHOULD transform the text into an empty array', () => {

            const entryText = "sshd[22608]: Failed password for root from 112.85.42.88 port 22743 ssh2";
            const response = evidence.wsmSplitData(entryText);
            expect(response).to.eql([]);
        });

        it('SHOULD transform the text into an array of object', () => {

            const entryText = "sshd[4624]|$pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=115.238.245.4  user=root evidence.class.ts:44:8";
            const response = evidence.wsmSplitData(entryText);
            expect(response).to.eql([
                {
                    key: 'pam_unix(sshd:auth): authentication failure; logname',
                    value: ' uid=0 euid=0 tty=ssh ruser= rhost=115.238.245.4  user=root evidence.class.ts:44:8',
                },
            ]);
        });
    });

    describe('WHEN wsmSelectData() is called', () => {

        it('SHOULD select the first message for the entered search criteria', () => {

            const wsmMessageData = [
                {
                    key: 'sshd[22608]',
                    value: 'Failed password for root from 112.85.42.88 port 22743 ssh2',
                },
                {
                    key: 'sshd[27782]',
                    value: 'Failed password for root from 112.85.42.88 port 27843 ssh2',
                },
            ];
            const response = evidence.wsmSelectData(wsmMessageData, 'sshd[22608]');
            expect(response).to.equal(wsmMessageData[0]);
        });
    });
});
