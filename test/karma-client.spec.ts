import { KalmClient, StorageDescriptor, StorageDescriptorColumn} from '../src/index';
import { expect, assert } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'kalm';
const accountID = 1234;
const serviceVersion = 'v1';

afterEach(() => {
  sinon.restore();
});

describe('Kalm Client Test Suite', () => {
  const accountId = '1234';
  describe('when retrieving catalog tables', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(KalmClient['alClient'], 'fetch');
    });

    afterEach(() => {
      stub.restore();
    });

    it ('should should call fetch() on the ALClient instance to the kalm catalog tables items endpoint for all tables', async() => {
      await KalmClient.listCatalogTables();
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        version: serviceVersion,
        path: '/catalog/table'
      };

      assert.deepEqual(payload, stub.args[0][0]);
    });

    it ('should should call fetch() on the ALClient instance to the kalm catalog tables items endpoint for a single table', async() => {
      await KalmClient.getCatalogTable('test');
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        version: serviceVersion,
        path: '/catalog/table/test'
      };

      assert.deepEqual(payload, stub.args[0][0]);
    });

    it ('should should call fetch() on the ALClient instance to the startSimpleQuery end point', async() => {
      await KalmClient.startSimpleQuery(accountId, 'test');
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        version: serviceVersion,
        account_id: accountId,
        path: `/query/test`
      };

      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
});
