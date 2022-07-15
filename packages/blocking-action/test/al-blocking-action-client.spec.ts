import { AlDefaultClient } from '@al/core';
import {
  expect,
} from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlBlockingActionClient } from '../src/index';

const serviceName = 'whois';

beforeEach( () => {
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );
afterEach(() => {
  sinon.restore();
});

describe('whois Service Client Test Suite', () => {
  const accountId = '2';
  const blockingActionMock = {
    "email": "test@test.co", 
    "ingestid": "YikP3AAAACAAAvTmAAM6IA==", 
    "duration": 60, 
    "source_ip": "2001:db8::dead:beef", 
    "eventid": 2793408425
  };
  describe('when getting whois data', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { }}));
    });

    afterEach(() => {
      stub.restore();
    });

    it('should call the AlDefaultClient instance\'s GET.', async() => {
      await AlBlockingActionClient.create(accountId, blockingActionMock);
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0].url).to.contains(`/blocking/v1/${accountId}/action`);
    });
  });
});
