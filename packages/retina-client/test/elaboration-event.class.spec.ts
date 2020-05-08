/**
 * Test suite for the ElaborationEvent class
 *
 * @author Bryan Tabarez <bryan.tabarez@alertlogic.com>
 * @copyright Alert Logic, Inc 2017
 */
/**
* -----
* Last Modified: Wednesday, 5th December 2018 3:28:11 pm
* Modified By:
* @author Harold Velez <harold.velez@alertlogic.com>
* -----
* @copyright 2018 Alert Logic Inc., Alert Logic Inc.
*/
import { expect } from 'chai';
import { describe } from 'mocha';
import { ElaborationEvent } from "../src/types/elaboration-event.class";
import rawMock from "./evidence-raw-data.json";

describe('ElaborationEvent', () => {

    const snortInfo_default = {
        al_id: 0,
        dest_ip: "None",
        dest_port: "None",
        protocol: "None",
        raw: "no snort info available",
        revision: "0",
        signature_id: "0",
        snort_msg: "no snort info available",
        src_ip: "none",
        src_port: "none",
    };

    it('should match with initial values', () => {
        const elaborationEvent = new ElaborationEvent();
        expect(elaborationEvent.dst).to.equal("");
        expect(elaborationEvent.payload).to.eql([]);
        expect(elaborationEvent.protocol_decodes).to.eql([]);
        expect(elaborationEvent.application_payload).to.eql([]);
        expect(elaborationEvent.src).to.equal("");
        expect(elaborationEvent.ip_proxy).to.equal("");
        expect(elaborationEvent.gzipDecode).to.eql([{
            header: "",
            value: "",
        }]);
        expect(elaborationEvent.ip_proxy_client).to.equal("");
        expect(elaborationEvent.snortInfo).to.eql(snortInfo_default);
    });

    it('SHOULD has the properties without initial values', () => {
        const elaborationEvent = new ElaborationEvent();
        expect(elaborationEvent.event_id).to.equal(undefined);
        expect(elaborationEvent.appliance).to.equal(undefined);
        expect(elaborationEvent.sig_id).to.equal(undefined);
        expect(elaborationEvent.ts).to.equal(undefined);
        expect(elaborationEvent.protoFacets).to.equal(undefined);
    });

    describe('WHEN raw NOT HAS the properties', () => {
        it('when deserialize method is called should create an ElaborationEvent', () => {
            const elaborationEvent = ElaborationEvent.deserialize({});
            expect(elaborationEvent).to.be.an.instanceOf(ElaborationEvent);
        });
    });

    describe('WHEN raw HAS the properties', () => {
        it('when deserialize method is called should create an ElaborationEvent with the properties in raw parameter', () => {
            const elaborationEvent = ElaborationEvent.deserialize(rawMock);
            expect(elaborationEvent.dst).to.equal(rawMock.dst);
            expect(elaborationEvent.application_payload).to.equal(rawMock.application_payload);
            expect(elaborationEvent.appliance).to.equal(rawMock.__appliance_name);
            expect(elaborationEvent.event_id).to.equal(rawMock.event_id);
            expect(elaborationEvent.payload).to.equal(rawMock.payload);
            expect(elaborationEvent.gzipDecode).to.equal(rawMock.__gzipDecode);
            expect(elaborationEvent.protocol_decodes).to.equal(rawMock.protocol_decodes);
            expect(elaborationEvent.sig_id).to.equal(rawMock.sig_id);
            expect(elaborationEvent.src).to.equal(rawMock.src);
            expect(elaborationEvent.ts).to.equal(rawMock.ts);
            expect(elaborationEvent.snortInfo).to.equal(rawMock.__snortInfo);
            expect(elaborationEvent.protoFacets).to.equal(rawMock.__protoFacets);
            expect(elaborationEvent.ip_proxy).to.equal(rawMock.ip_proxy);
            expect(elaborationEvent.ip_proxy_client).to.equal(rawMock.ip_proxy_client);
        });
    });

});
