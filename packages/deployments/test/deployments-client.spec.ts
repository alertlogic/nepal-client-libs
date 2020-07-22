import {
  assert,
  expect,
} from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import {
  AlDeploymentsClientInstance,
  DeploymentCreateBody,
} from '../src/index';

let deploymentsClient:AlDeploymentsClientInstance;

const serviceName = 'deployments';
const deploymentRequestBody: DeploymentCreateBody = {
  name: 'deployment',
  platform: { type: 'aws' },
};
const accountId = '1234';
const deploymentId = '56789';

beforeEach(() => {
  deploymentsClient = new AlDeploymentsClientInstance();
});
afterEach(() => {
  sinon.restore();
});

describe('Deployments Client Test Suite', () => {
  describe('when creating a deployment', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(deploymentsClient.client, 'post');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call post() on the AlDefaultClient instance to the deployments endpoint', async() => {
      await deploymentsClient.createDeployment(accountId, deploymentRequestBody);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments',
        data: deploymentRequestBody,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when updating a deployment', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(deploymentsClient.client, 'put');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call put() on the AlDefaultClient instance to the deployments endpoint', async() => {
      await deploymentsClient.updateDeployment(accountId, deploymentId, deploymentRequestBody);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments/56789',
        data: deploymentRequestBody,
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when deleting a deployment', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(deploymentsClient.client, 'delete');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call delete() on the AlDefaultClient instance to the deployments endpoint', async() => {
      await deploymentsClient.deleteDeployment(accountId, deploymentId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments/56789',
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when retrieving a deployment', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(deploymentsClient.client, 'get');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call get() on the AlDefaultClient instance to the deployments endpoint', async() => {
      await deploymentsClient.getDeployment(accountId, deploymentId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments/56789',
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
  describe('when listing deployments for an account', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(deploymentsClient.client, 'get');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call get() on the AlDefaultClient instance to the deployments endpoint', async() => {
      await deploymentsClient.listDeployments(accountId, ['foo=bar']);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments',
        params: ['foo=bar']
      };
      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
});
