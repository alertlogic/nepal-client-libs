import { AetherClient } from '../src/index';
import { expect, assert } from 'chai';
import { describe, before } from 'mocha';
import * as sinon from 'sinon';

const serviceName = 'aether';

afterEach(() => {
  sinon.restore();
});
describe('Aether Client Test Suite:', () => {
  describe('when searching', () => {
    let stub: sinon.SinonSpy;
    beforeEach(() => {
      stub = sinon.stub(AetherClient['alClient'], 'fetch');
    });
    afterEach(() => {
      stub.restore();
    });
    it('should call fetch() on the ALClient instance', async() => {
      await AetherClient.search({q: 'bob', size: 1000, sort: 'asc', start: 1, format: 'json'});
      expect(stub.callCount).to.equal(1);
    });
  });
    
});
