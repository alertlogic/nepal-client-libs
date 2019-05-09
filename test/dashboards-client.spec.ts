import { DashboardsClient, DashboardRequest } from '../src/index';
import { expect, assert } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'dashboards';
const accountId = '12345';
const userId = '332211';
const deploymentId = 'xy`-123';
const dashboardItemId = '00-AA-11-XY';
const dashboardItemRequest: DashboardRequest = {
  name: 'My Item',
  type: 'my_thing',
  my_thing: { foo: 'bar' },
};

afterEach(() => {
  sinon.restore();
});
describe('Dashboards Client Test Suite:', () => {
  describe('when creating a deployment dashboard item', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance to the deployments dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.createDeploymentDashboardItem(accountId, deploymentId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/deployments/${deploymentId}/dashboard_items`,
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving a single dashboard item for a given deployment', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the deployments dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.getDeploymentDashboardItem(accountId, deploymentId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when updating a dashboard item for a given deployment', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance to the deployments dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.updateDeploymentDashboardItem(accountId, deploymentId, dashboardItemId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when deleting a dashboard item for a given deployment', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the ALClient instance to the deployments dashboard items endpoint', async() => {
      await DashboardsClient.deleteDeploymentDashboardItem(accountId, deploymentId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/deployments/${deploymentId}/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retreiving all dashboard items for a given deployment', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the deployments dashboard items endpoint', async() => {
      await DashboardsClient.listDeploymentDashboardItems(accountId, deploymentId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/deployments/${deploymentId}/dashboard_items`,
        params: {},
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  // users...
  describe('when creating a user dashboard item', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.createUserDashboardItem(accountId, userId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/users/${userId}/dashboard_items`,
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving a single dashboard item for a given user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.getUserDashboardItem(accountId, userId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when updating a dashboard item for a given user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.updateUserDashboardItem(accountId, userId, dashboardItemId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when deleting a dashboard item for a given user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the ALClient instance to the users dashboard items endpoint', async() => {
      await DashboardsClient.deleteUserDashboardItem(accountId, userId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/users/${userId}/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retreiving all dashboard items for a given user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the users dashboard items endpoint', async() => {
      await DashboardsClient.listUserDashboardItems(accountId, userId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/users/${userId}/dashboard_items`,
        params: {},
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  //own
  describe('when creating a dashboard item for the currently authenticated user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.createOwnDashboardItem(accountId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/user/dashboard_items',
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving a single dashboard item for the currently authenticated user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.getOwnDashboardItem(accountId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/user/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when updating a dashboard item for the currently authentciated user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'set');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call set() on the ALClient instance to the users dashboard items endpoint with the correct payload', async() => {
      await DashboardsClient.updateOwnDashboardItem(accountId, dashboardItemId, dashboardItemRequest);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/user/dashboard_items/${dashboardItemId}`,
        data: dashboardItemRequest,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when deleting a dashboard item for the currently authenticated user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'delete');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call delete() on the ALClient instance to the users dashboard items endpoint', async() => {
      await DashboardsClient.deleteOwnDashboardItem(accountId, dashboardItemId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: `/user/dashboard_items/${dashboardItemId}`,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retreiving all dashboard items for the currently authenticated user', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(DashboardsClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance to the users dashboard items endpoint', async() => {
      await DashboardsClient.listOwnDashboardItems(accountId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/user/dashboard_items',
        params: {},
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
});
