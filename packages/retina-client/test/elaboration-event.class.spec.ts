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
import evidenceRawDataJson from "./evidence-raw-data.json";

describe('ElaborationEvent', () => {

    const snortInfoDefault = {
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
        expect(elaborationEvent.snortInfo).to.eql(snortInfoDefault);
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
            const elaborationEvent = ElaborationEvent.deserialize(evidenceRawDataJson);
            expect(elaborationEvent.dst).to.equal(evidenceRawDataJson.dst);
            expect(elaborationEvent.application_payload).to.equal(evidenceRawDataJson.application_payload);
            expect(elaborationEvent.appliance).to.equal(evidenceRawDataJson.__appliance_name);
            expect(elaborationEvent.event_id).to.equal(evidenceRawDataJson.event_id);
            expect(elaborationEvent.payload).to.equal(evidenceRawDataJson.payload);
            expect(elaborationEvent.gzipDecode).to.equal(evidenceRawDataJson.__gzipDecode);
            expect(elaborationEvent.protocol_decodes).to.equal(evidenceRawDataJson.protocol_decodes);
            expect(elaborationEvent.sig_id).to.equal(evidenceRawDataJson.sig_id);
            expect(elaborationEvent.src).to.equal(evidenceRawDataJson.src);
            expect(elaborationEvent.ts).to.equal(evidenceRawDataJson.ts);
            expect(elaborationEvent.snortInfo).to.equal(evidenceRawDataJson.__snortInfo);
            expect(elaborationEvent.protoFacets).to.equal(evidenceRawDataJson.__protoFacets);
            expect(elaborationEvent.ip_proxy).to.equal(evidenceRawDataJson.ip_proxy);
            expect(elaborationEvent.ip_proxy_client).to.equal(evidenceRawDataJson.ip_proxy_client);
        });
    });

});
