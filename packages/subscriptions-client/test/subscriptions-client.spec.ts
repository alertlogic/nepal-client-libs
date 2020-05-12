import {
  assert,
  expect,
} from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { SubscriptionsClient } from '../src/index';

const serviceName = 'subscriptions';
const accountId = '12345';
const queryParams = { foo: 'bar' };

afterEach(() => {
  sinon.restore();
});
describe('Subscriptions Client Test Suite:', () => {
  describe('when retrieving entitlements for a given account', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    //  Tautological tests are empty tests
    xit('should call get() on the AlDefaultClient instance to the entitlements endpoint', async() => {
      await SubscriptionsClient.getRawEntitlements(accountId, queryParams);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/entitlements',
        params: queryParams,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving accounts for a given enitlement', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    xit('should call get() on the AlDefaultClient instance to the entitlements endpoint', async() => {
      const productFamily = 'log_manager';
      await SubscriptionsClient.getAccountsByEntitlement(accountId, productFamily);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/entitlements/${productFamily}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when creating an AWS subscription', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance to the /subscription/aws endpoint with the subscription data', async() => {
      const subscription = {
        product_code:'ebbgj0o0g5cwo4**********',
        aws_customer_identifier:'7vBT7cnzEYf',
        status:'subscribe-success',
      };
      await SubscriptionsClient.createAWSSubscription(accountId, subscription);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/subscription/aws',
        data: subscription,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when creating a full subscription', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance to the /subscription endpoint using the supplied entitements in the subscription data sent', async() => {
      const entitlements = [{
        product_family_code:'log_manager',
        status:'active',
      }];
      const subscriptionData = {
        entitlements,
        active: true,
        type: 'manual',
      };
      await SubscriptionsClient.createFullSubscription(accountId, entitlements);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/subscription',
        data: subscriptionData,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when creating a standard subscription', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance to the standard subscription endpoint', async() => {
      await SubscriptionsClient.createStandardSubscription(accountId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/subscription/sync/standard',
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving a single subscription', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance to the subscription endpoint for the supplied subscription ID', async() => {
      const subscriptionId = '123-ABC=-?!';
      await SubscriptionsClient.getSubscription(accountId, subscriptionId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/subscription/${subscriptionId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving all subscriptions', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'get');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call get() on the AlDefaultClient instance to the subscriptions endpoint for the supplied subscription ID', async() => {
      await SubscriptionsClient.getSubscriptions(accountId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/subscriptions',
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving all subscriptions', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(SubscriptionsClient['client'], 'put');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call put() on the AlDefaultClient instance to the subscription/aws endpoint with the supplied subscription data', async() => {
      const subscription = {
        product_code:'ebbgj0o0g5cwo4**********',
        status:'unsubscribe-success',
      };
      await SubscriptionsClient.updateAWSSubscription(accountId, subscription);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/subscription/aws',
        data: subscription,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
});
