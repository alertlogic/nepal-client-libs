/**
 * Test suite for the ElaborationGuardDuty class
 *
 * @author maryit <msanchez@alertlogic.com>
 * @copyright Alert Logic, Inc 2017
 */
import { expect } from 'chai';
import { describe } from 'mocha';
import { ElaborationGuardDuty } from "../src/types/elaboration-guard-duty.class";

describe('ElaborationGuardDuty', () => {

    const rawDataMock = {
        __contentType: "",
        __description: "",
        __messageId: "",
        __normalizedTime: "",
        __relatedOrAssociated: "",
        __source: "",
        __uuid: "",
        uuid: "123",
        description: "hey we found a teasure",
    };

    it('should match with initial values', () => {
        const elaboration = new ElaborationGuardDuty();
        expect(elaboration.rawGuardDutyElaboration).to.equal(null);
    });

    it('when cleanGuardDutyRaw method is called should clean the raw data', () => {
        const dataTest = {
            uuid: rawDataMock.uuid,
            description: rawDataMock.description,
        };
        const elaboration = ElaborationGuardDuty.cleanGuardDutyRaw(rawDataMock);
        expect(elaboration).to.eql(dataTest);
    });

    it('when deserialize method is called should clean the raw', () => {
        const elaboration = ElaborationGuardDuty.deserialize(rawDataMock);

        const dataTest = {
            uuid: rawDataMock.uuid,
            description: rawDataMock.description,
        };

        expect(elaboration.rawGuardDutyElaboration).to.eql(dataTest);
    });

});
