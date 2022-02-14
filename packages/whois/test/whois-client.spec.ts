import { AlDefaultClient } from '@al/core';
import {
  expect,
} from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlWhoisClient } from '../src/index';

const serviceName = 'whois';

beforeEach( () => {
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );
afterEach(() => {
  sinon.restore();
});

describe('whois Service Client Test Suite', () => {
  const ip = '8.8.4.4';
  describe('when getting whois data', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { }}));
    });

    afterEach(() => {
      stub.restore();
    });

    it('should call the AlDefaultClient instance\'s GET.', async() => {
      await AlWhoisClient.get(ip);
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0].url).to.contains("/whois/v1/query/8.8.4.4");
    });
  });
});
