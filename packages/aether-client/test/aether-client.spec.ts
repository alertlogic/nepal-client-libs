import { expect } from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AetherClient } from '../src/index';

const serviceName = 'aether';

afterEach(() => {
  sinon.restore();
});
describe('Aether Client Test Suite:', () => {
  describe('when searching', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AetherClient.client, 'post');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the AlDefaultClient instance', async() => {
      await AetherClient.search('bob');
      expect(stub.callCount).to.equal(1);
    });
  });

});
