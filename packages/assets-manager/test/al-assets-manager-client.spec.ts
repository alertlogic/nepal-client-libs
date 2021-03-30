import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlAssetsManagerClientInstance } from '../src/index';

let assetsManagerClient:AlAssetsManagerClientInstance;

beforeEach(() => {
  assetsManagerClient = new AlAssetsManagerClientInstance();
});
afterEach(() => {
  sinon.restore();
});

describe('Assets Manager  Client Test Suite:', () => {
    describe('when getting Report Summary', () => {
        let stub: sinon.SinonSpy;

        beforeEach(() => {
          stub = sinon.stub(assetsManagerClient.client, 'get');
        });

        afterEach(() => {
          stub.restore();
        });
        
        it('should call get() on the AlDefaultClient instance', async () => {
          const accountId = '2';
          const deploymentId = 'XXX-YYY-ZZZ-000';
          const qParams = {asset_key: '1234', asset_type: 'vpc'};
          await assetsManagerClient
                .getReportSummary(accountId, deploymentId, qParams);
          expect(stub.callCount).to.equal(1);
        });
      });
})