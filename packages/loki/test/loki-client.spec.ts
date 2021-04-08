import { assert, expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlLokiClientInstance } from '../src';

const serviceName = 'loki';
const serviceVersion = 'v1';

afterEach(() => {
    sinon.restore();
});

describe('Loki Client Test Suite', () => {
    const accountId = '1234';
    let stub: sinon.SinonSpy;
    let lokiClient: AlLokiClientInstance;

    beforeEach(() => {
        lokiClient = new AlLokiClientInstance();
    });

    afterEach(() => {
        stub.restore();
    });

    it('should should call post() on the AlDefaultClient instance to Loki setting IP addresses', async() => {
        stub = sinon.stub(lokiClient['client'], 'post');
        await lokiClient.addIpAddress(accountId, 'whitelist', 'ANY', [ '192.168.1.1' ]);
        expect(stub.callCount).to.equal(1);
        const payload = {
            service_name: serviceName,
            service_stack: 'global:api',
            version: serviceVersion,
            path: `/whitelist/ANY`,
            account_id: accountId,
            params: { ip_addresses: [ '192.168.1.1' ]}
        };

        assert.deepEqual(payload, stub.args[0][0]);
    });

    it('should should call get() on the AlDefaultClient instance to Loki querying an IP address', async() => {
        stub = sinon.stub(lokiClient['client'], 'get');
        await lokiClient.queryIpAddress(accountId, 'whitelist', 'ANY', '192.168.1.1');
        expect(stub.callCount).to.equal(1);
        const payload = {
            service_name: serviceName,
            service_stack: 'global:api',
            version: serviceVersion,
            path: `/whitelist/ANY`,
            account_id: accountId,
            params: { contains: '192.168.1.1' }
        };

        assert.deepEqual(payload, stub.args[0][0]);
    });

    it('should should call post() on the AlDefaultClient instance to Loki delete IP addresses', async() => {
        stub = sinon.stub(lokiClient['client'], 'delete');
        await lokiClient.deleteIpAddress(accountId, 'whitelist', 'ANY', [ '192.168.1.1' ]);
        expect(stub.callCount).to.equal(1);
        const payload = {
            service_name: serviceName,
            service_stack: 'global:api',
            version: serviceVersion,
            path: `/whitelist/ANY`,
            account_id: accountId,
            params: { ip_addresses: [ '192.168.1.1' ]}
        };

        assert.deepEqual(payload, stub.args[0][0]);
    });
});
