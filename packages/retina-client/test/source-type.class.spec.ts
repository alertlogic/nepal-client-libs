/**
 * SourceType class' test suite
 *
 * @author Jhon Pantoja <jhon.pantoja@alertlogic.com>
 * @copyright Alert Logic, Inc 2017
 *  * -----
 * Last Modified: Friday, 14th December 2018
 * Modified:  @author Juan Daniel Galarza Rodriguez <juan.galarza@alertlogic.com>
 * -----
 */
import { expect } from 'chai';
import { describe } from 'mocha';
import { SourceType } from '../src/types/source-type.class';

describe('SourceType class', () => {

    // SourceType CLASS ATTRIBUTES
    it('SHOULD check the class attributes values', () => {
        expect(SourceType.AUDITLOG).to.equal('Incident Audit Trail');
        expect(SourceType.FLAGGED).to.equal('Flagged Evidence');
        expect(SourceType.ASSOCLOG).to.equal('application/x-alpacket-logmsgs');
        expect(SourceType.ASSOCEVENT).to.equal('application/x-alpacket-snmsgs');
        expect(SourceType.ASSOCWEBEVENT).to.equal('application/x-alpacket-wafmsgs');
        expect(SourceType.GUARDDUTY).to.equal('guardduty');
        expect(SourceType.ASSOCLOGMEG).to.equal('application/x-alpacket-megmsgs');
    });

    // getSourceName STATIC FUNCTION
    describe('WHEN getSourceName function is called', () => {
        let type;

        it('SHOULD test switch statement for "application/x-alpacket-logmsgs" case', () => {
            type = "application/x-alpacket-logmsgs";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal("Log");
        });
        it('SHOULD test switch statement for "application/x-alpacket-wafmsgs" case', () => {
            type = "application/x-alpacket-wafmsgs";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal("Log");
        });
        it('SHOULD test switch statement for "application/x-alpacket-snmsgs" case', () => {
            type = "application/x-alpacket-snmsgs";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal("Event");
        });
        it('SHOULD test switch statement for "application/x-alpacket-megmsgs" case', () => {
            type = "application/x-alpacket-megmsgs";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal("Log");
        });
        it('SHOULD test switch statement for "guardduty" case', () => {
            type = "guardduty";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal("GuardDuty findings");
        });
        it('SHOULD test switch statement for default case', () => {
            type = "new";
            const result = SourceType.getSourceName(type);
            expect(result).to.equal(type);
        });
    });
    // getType STATIC FUNCTION
    describe('WHEN getType function is called', () => {
        let type;
        beforeEach(() => {
            type = "";
        });
        it('SHOULD test switch statement for "application/x-alpacket-logmsgs" case', () => {
            type = "application/x-alpacket-logmsgs";
            const result = SourceType.getType(type);
            expect(result).to.equal("associated log");
        });
        it('SHOULD test switch statement for "application/x-alpacket-wafmsgs" case', () => {
            type = "application/x-alpacket-wafmsgs";
            const result = SourceType.getType(type);
            expect(result).to.equal("associated log");
        });
        it('SHOULD test switch statement for "application/x-alpacket-snmsgs" case', () => {
            type = "application/x-alpacket-snmsgs";
            const result = SourceType.getType(type);
            expect(result).to.equal("associated event");
        });
        it('SHOULD test switch statement for "application/x-alpacket-megmsgs" case', () => {
            type = "application/x-alpacket-megmsgs";
            const result = SourceType.getType(type);
            expect(result).to.equal("associated log");
        });
        it('SHOULD test switch statement for "guardduty" case', () => {
            type = "guardduty";
            const result = SourceType.getType(type);
            expect(result).to.equal("guardduty");
        });
        it('SHOULD test switch statement for default case', () => {
            type = "new";
            const result = SourceType.getType(type);
            expect(result).to.equal(type);
        });
    });
});
