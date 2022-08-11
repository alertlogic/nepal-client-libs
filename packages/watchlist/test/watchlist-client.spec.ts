import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlWatchlistClientInstance } from '../src/index';

let watchlistClient:AlWatchlistClientInstance;
const accountId = '2';
const deploymentId = 'AAAA-BBBB-CCCC-DDD';
const userId = '6';
const assetKey = 'ZZZ-WWW-XXX';

beforeEach(() => {
  watchlistClient = new AlWatchlistClientInstance();
});
afterEach(() => {
  sinon.restore();
});
describe('Watchlist Client Test Suite:', () => {
  describe('when adding to the watchlist', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(watchlistClient['client'], 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call post() on the AlDefaultClient instance', async () => {
      await watchlistClient.add(accountId, deploymentId, userId, assetKey);
      expect(stub.callCount).to.equal(1);
    });
  });
});

