/**
 * Test suite for the ElaborationLog class
 *
 * @author Bryan Tabarez <bryan.tabarez@alertlogic.com>
 * -----
 * Last Modified: Thursday, 13th December 2018
 * Modified By: @author Juan Daniel Galarza Rodriguez <juan.galarza@alertlogic.com>
 * -----
 * @copyright Alert Logic, Inc 2017
 */
import { expect } from 'chai';
import { describe } from 'mocha';
import { ElaborationLog } from "../src/types/elaboration-log.class";

describe('ElaborationLog type', () => {
    it('SHOULD match with the initial values', () => {
        const elaborationLog = new ElaborationLog();
        expect(elaborationLog.message).to.equal("");
        expect(elaborationLog.messageId).to.equal("");
        expect(elaborationLog.messageCategory).to.equal(undefined);
        expect(elaborationLog.sourceType).to.equal('');
        expect(elaborationLog.appliance).to.equal(undefined);
        // expect(elaborationLog.tokens).to.equal([]);
        expect(elaborationLog.sourceHostIp).to.equal("");
        expect(elaborationLog.sourceName).to.equal("");
        expect(elaborationLog.rulename).to.equal("");
        expect(elaborationLog.host_id).to.equal("");
        expect(elaborationLog.tokens_ParsedMessage).to.eql({});
        expect(elaborationLog.tokens_LogSources).to.eql({});
    });

    describe('WHEN the static method proccessTokens is called', () => {
        let tokensMock;

        it('SHOULD filter the tokens in array and string', () => {
            tokensMock = [
                {
                    description: "Text",
                    tokenName: "text",
                    value: [
                        "0",
                        "44860715",
                        "Unknown",
                    ],
                },
                {
                    description: "Log Event Type",
                    tokenName: "log_information.win_log.win_event.win_log_type",
                    value: "Security",
                }];
            const tokensFilter = ElaborationLog.proccessTokens(tokensMock);
            expect(tokensFilter.length).to.equal(2);
            expect(tokensFilter[0].valueType).to.equal("array");
            expect(tokensFilter[1].valueType).to.equal("string");
        });

        it("SHOULD return an empty array if the tokens' value property is null ", () => {
            tokensMock = [{
                description: "Log Event Type",
                tokenName: "text",
                value: null,
            }];
            const tokensFilter = ElaborationLog.proccessTokens(tokensMock);
            expect(tokensFilter).to.eql([]);
        });
    });

    describe('WHEN the static method deserialize is called', () => {
        let rawMock:any;
        let elaborationLog:ElaborationLog;

        it('SHOULD return an Elaboration object with the attributes passed in raw', () => {
            rawMock = {
                message: 'message event log',
                program: null,
                messageId: '1',
                category_name: 'Account Modification',
                __tokens: {
                    log_sources: { facility: "user" },
                    message_fields: { "date.time": "Time" },
                    parsed_message: { "date.time": "Mon Jul 30 11:21:03 PDT 2018" },
                },
                __source_host_ip: 'host_ip',
                __sourceName: "400147-www19.corecommerce.com",
                __host_id: 'host_id',
                __sourceType: "syslog",
                __host_name: 'host1',
            };

            elaborationLog = ElaborationLog.deserialize(rawMock);

            expect(elaborationLog.message).to.equal(rawMock.message);
            expect(elaborationLog.messageId).to.equal(rawMock.messageId);
            expect(elaborationLog.messageCategory).to.equal(rawMock.category_name);
            expect(elaborationLog.sourceType).to.equal(rawMock.__sourceType);
            expect(elaborationLog.appliance).to.equal(rawMock.__source_type);
            expect(elaborationLog.sourceHostIp).to.equal(rawMock.__source_host_ip);
            expect(elaborationLog.sourceName).to.equal(rawMock.__sourceName);
            expect(elaborationLog.rulename).to.equal('');
            expect(elaborationLog.host_id).to.equal(rawMock.__host_id);
            expect(elaborationLog.tokens_ParsedMessage).to.eql({ Time: 'Mon Jul 30 11:21:03 PDT 2018' });
            expect(elaborationLog.tokens_LogSources).to.eql({});
            expect(elaborationLog.host_name).to.equal(rawMock.__host_name);
        });

        it('SHOULD return an elaboration object which has default values if raw data has not the attributes', () => {
            rawMock = {};
            elaborationLog = ElaborationLog.deserialize(rawMock);

            expect(elaborationLog).to.be.an.instanceOf(ElaborationLog);
            expect(elaborationLog.message).to.equal("");
            expect(elaborationLog.messageId).to.equal("");
            expect(elaborationLog.messageCategory).to.equal(undefined);
            expect(elaborationLog.sourceType).to.equal('');
            expect(elaborationLog.appliance).to.equal(undefined);
            // expect(elaborationLog.tokens).to.equal([]);
            expect(elaborationLog.sourceHostIp).to.equal("");
            expect(elaborationLog.sourceName).to.equal("");
            expect(elaborationLog.rulename).to.equal("");
            expect(elaborationLog.host_id).to.equal("");
            expect(elaborationLog.tokens_ParsedMessage).to.eql({});
            expect(elaborationLog.tokens_LogSources).to.eql({});
        });

        describe('WHEN raw param has "__tokens" property', () => {
            describe('WHEN "__tokens" property is different that "unavaliable"', () => {
                describe('WHEN "log_sources" has "log" property', () => {
                    xit('SHOULD add the property to tokens_LogSourcesValues of elaborationLog', () => {
                        rawMock = {
                            program: "program",
                            __tokens: {
                                log_sources: {
                                    category_id: "406654F6-B678-11DD-91D5-000C29ED5FAF",
                                    category_name: "Failed Login",
                                    customer: 134250395,
                                    facility: "daemon",
                                    host: [
                                        "13.56.168.60",
                                        "172.31.8.146",
                                        "fe80::4ee:7bff:fe3e:eca2",
                                    ],
                                    "host.ec2_account_id": "481746159046",
                                    "host.ec2_ami_id": "ami-e0100580",
                                    "host.ec2_availability_zone": "us-west-1c",
                                    "host.ec2_instance_id": "i-05f8e80b8d2efbe40",
                                    "host.ec2_instance_type": "t2.micro",
                                    "host.ec2_region": null,
                                    "host.host_type": null,
                                    "host.is_role": 0,
                                    "host.local_hostname": "ip-172-31-8-146.us-west-1.compute.internal",
                                    "host.local_ipv4": "172.31.8.146",
                                    "host.local_ipv6": "fe80::4ee:7bff:fe3e:eca2",
                                    "host.os_details": "Linux; 4.4.0-1060-aws; #69-Ubuntu SMP Sun May 20 13:42:07 UTC 2018; x86_64",
                                    "host.os_type": "unix",
                                    "host.public_hostname": "ec2-13-56-168-60.us-west-1.compute.amazonaws.com",
                                    "host.public_ipv4": "13.56.168.60",
                                    "host.public_ipv6": null,
                                    host_id: "874FFD40-6D64-1005-99F2-005056AB7FA5",
                                    message: "sshd[25866]: Failed password for root from 223.111.139.247 port 60752 ssh2",
                                    message_id: "QU1JMwgAf5sAAx20XBKoxVwSqSEAAFstAB9T/VZotngR3ZP4AAwp7V+vTE9HTVNH",
                                    meta_id: "55613accf97b537dc0a17728bd04a5f05b2afdd5",
                                    pid: 25866,
                                    priority: 1,
                                    program: "sshd",
                                    ruleid: "53FD5668-B678-11DD-93F8-000C29ED5FAF",
                                    ruleinfo: [
                                        "53FD5668-B678-11DD-93F8-000C29ED5FAF",
                                        "53FC7C98-B678-11DD-93ED-000C29ED5FAF",
                                    ],
                                    rulename: "Unix SSH Login Failed",
                                    sensor: 204212,
                                    source_id: "8C65B59B-6D64-1005-BA51-005056AB1986",
                                    time: 1544726801,
                                },
                                message_fields: {
                                    "date.time.timestamp": "Timestamp",
                                    "file.file_path": "File Path",
                                    "header.addr.host_name.server_host_name": "Server Host Name",
                                    "header.addr.host_name.src_host_name": "Src Host Name",
                                    "header.addr.ip_addr.src_ip_addr": "Src Host",
                                    "header.port": "Port",
                                    "header.protocol": "Proto",
                                    "key.key_name": "Key Name",
                                    "log_information.ffc_desc": "Flat File Log Description",
                                    "log_information.msg_id": "Message ID (Log Information)",
                                    "log_information.syslog_fields.euid": "EUID",
                                    "log_information.syslog_fields.fac_pri": "Facility and Priority",
                                    "log_information.syslog_fields.header": "Syslog Header",
                                    "log_information.syslog_fields.pid": "Syslog Fields PID",
                                    "logon.login_method": "Logon Method",
                                    "logon.login_method.remote_login_method": "Remote Logon Method",
                                    "logon.logon_count": "Logon Attempt Count",
                                    message: "Message (Token)",
                                    "parameters.required": "Required Parameters",
                                    reason: "Reason",
                                    "shell_env.terminal": "Terminal",
                                    text: "Text",
                                    "text.count": "Count",
                                    "text.count.1": "Count",
                                    "user.uid": "UID",
                                    "user.user_name.remote_user_name": "Remote User",
                                    "user.user_name.src_user_name": "Src User",
                                    "user.user_name.target_user_name": "Target User",
                                    word_ending: "Word Ending",
                                },
                                parsed_message: {
                                    "header.addr.ip_addr.src_ip_addr": "223.111.139.247",
                                    "header.port": "60752",
                                    "header.protocol": "ssh2",
                                    "log_information.ffc_desc": "",
                                    "log_information.syslog_fields.pid": "25866",
                                    "user.user_name.target_user_name": "root",
                                },
                            },
                        };

                        elaborationLog = ElaborationLog.deserialize(rawMock);
                        const expected = [
                            '481746159046',
                            'ami-e0100580', 'us-west-1c',
                            'i-05f8e80b8d2efbe40',
                            't2.micro',
                            'ip-172-31-8-146.us-west-1.compute.internal',
                            '172.31.8.146',
                            'Linux; 4.4.0-1060-aws; #69-Ubuntu SMP Sun May 20 13:42:07 UTC 2018; x86_64',
                            'unix',
                            'ec2-13-56-168-60.us-west-1.compute.amazonaws.com',
                            '13.56.168.60',
                        ];
                        // todo fix me
                        console.log(elaborationLog.tokens_LogSources);
                        expect(elaborationLog.tokens_LogSources).to.eql(expected);
                    });
                });
                describe('WHEN "log_sources" has not "log" property', () => {
                    it('SHOULD add the property to tokens_LogSourcesValues of elaborationLog', () => {
                        rawMock = {
                            __tokens: {
                                log_sources: {},
                                message_fields: { "date.time": "Time" },
                                parsed_message: { "date.time": "Mon Jul 30 11:21:03 PDT 2018" },
                            },
                        };

                        elaborationLog = ElaborationLog.deserialize(rawMock);
                        expect(elaborationLog.tokens_LogSources).to.eql({});
                    });
                });
            });
        });
    });
});
