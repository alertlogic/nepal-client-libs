/**
 * Test suite for the Elaboration class
 *
 * @author Bryan Tabarez <bryan.tabarez@alertlogic.com>
 * @copyright Alert Logic, Inc 2017
 */

import { expect } from 'chai';
import { describe } from 'mocha';
import { Elaboration } from "../src/types/elaboration.class";
import { SourceType } from '../src/types/source-type.class';

describe('Elaboration', () => {

    const rawMock = {
        __normalizedTime: "2017-10-03T16:57:37.954947+00:00",
        __contentType: "application/x-alpacket-wafmsgs",
        __uuid: "efd75228bb3711e7bdf41227f70cfc16",
        __description: "51.15.0.49 is performing SSH brute force attacks against i-0eb7f8e4909acf29e.",
    };

    describe('when the deserialize method is called', () => {
        it('should return an Elaboration object', () => {
            const elaboration = Elaboration.deserialize({});
            expect(elaboration).to.be.an.instanceOf(Elaboration);
            expect(elaboration.description).to.equal("No description available.");
        });
        it('should return an Elaboration object with the properties in raw parameter', () => {
            const type = "associated event";
            const elaboration = Elaboration.deserialize(rawMock, type);
            expect(elaboration.time).to.eql(new Date(rawMock.__normalizedTime));
            expect(elaboration.evidenceType).to.equal(type);
            expect(elaboration.elaborationType).to.equal(SourceType.getType(rawMock.__contentType));
            expect(elaboration.uuid).to.equal(rawMock.__uuid);
            expect(elaboration.description).to.equal(rawMock.__description);
        });
    });

    describe('when the static method isValid', () => {
        let raw;
        let isValid;

        it('should return false if raw does not have the __normalizedTime property', () => {
            raw = {
                __uuid: "aaabbb111000",
            };
            isValid = Elaboration.isValid(raw);
            expect(isValid).to.equal(false);
        });

        it("should return false if raw's __normalizedTime property is not valid", () => {
            raw = {
                __uuid: "aaabbb111000",
                __normalizedTime: "hello word!",
            };
            isValid = Elaboration.isValid(raw);
            expect(isValid).to.equal(false);
        });

        it("should return false if raw doesn't have __uuid property", () => {
            raw = {
                __normalizedTime: "1995-02-04T01:00",
            };
            isValid = Elaboration.isValid(raw);
            expect(isValid).to.equal(false);
        });

        it("should return true if raw have __normalizedTime and __uuid properties and __normalizedTime is valid ", () => {
            raw = {
                __uuid: "aaabbb111000",
                __normalizedTime: "1995-02-04T01:00",
            };
            isValid = Elaboration.isValid(raw);
            expect(isValid).to.equal(true);
        });
    });

    describe('when the static method deserializeArray is called', () => {
        let rawData;
        let expectedElaborations;
        let elaborations;

        beforeEach(() => {
            rawData = [rawMock, rawMock];
            expectedElaborations = [Elaboration.deserialize(rawMock), Elaboration.deserialize(rawMock)];
            elaborations  = Elaboration.deserializeArray(rawData);
        });

        it('should check if the raws are valid and they are deserialized', () => {
            expect(elaborations.length).to.equal(rawData.length);
            expect(elaborations).to.eql(expectedElaborations);
        });
    });

});
