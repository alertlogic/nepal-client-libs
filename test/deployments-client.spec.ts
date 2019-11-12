import { DeploymentsClient, DeploymentCreateBody } from '../src/index';
import { expect, assert } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'deployments';
const deploymentRequestBody: DeploymentCreateBody = {
  name: 'deployment',
  platform: { type: 'aws' },
};
const accountId = '1234';
const deploymentId = '56789';

afterEach(() => {
  sinon.restore();
});

describe('Deployments Client Test Suite', () => {
  describe('when creating a deployment', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(DeploymentsClient['alClient'], 'post');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call post() on the ALClient instance to the deployments endpoint', async() => {
      await DeploymentsClient.createDeployment(accountId, deploymentRequestBody);
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
      stub = sinon.stub(DeploymentsClient['alClient'], 'set');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call set() on the ALClient instance to the deployments endpoint', async() => {
      await DeploymentsClient.updateDeployment(accountId, deploymentId, deploymentRequestBody);
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
      stub = sinon.stub(DeploymentsClient['alClient'], 'delete');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call delete() on the ALClient instance to the deployments endpoint', async() => {
      await DeploymentsClient.deleteDeployment(accountId, deploymentId);
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
      stub = sinon.stub(DeploymentsClient['alClient'], 'get');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call get() on the ALClient instance to the deployments endpoint', async() => {
      await DeploymentsClient.getDeployment(accountId, deploymentId);
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
      stub = sinon.stub(DeploymentsClient['alClient'], 'get');
    });

    afterEach(() => {
      stub.restore();
    });

    it('should should call get() on the ALClient instance to the deployments endpoint', async() => {
      await DeploymentsClient.listDeployments(accountId);
      expect(stub.callCount).to.equal(1);
      const payload = {
        service_name: serviceName,
        account_id: accountId,
        path: '/deployments',
      };

      assert.deepEqual(payload, stub.args[0][0]);
    });
  });
});
