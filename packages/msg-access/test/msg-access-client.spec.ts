import { AlDefaultClient, AlLocation, AlLocatorService } from '@al/core';
import {
  assert,
  expect,
} from 'chai';
import { describe } from 'mocha';
import * as sinon from 'sinon';
import { AlMsgAccessClient } from '../src/index';

const serviceName = 'msg_access';

beforeEach( () => {
  AlDefaultClient.setGlobalParameters( { noEndpointsResolution: true } );
} );
afterEach(() => {
  sinon.restore();
});

describe('msg_access Service Client Test Suite', () => {
  const accountId = '2';
  describe('when getting message details', () => {
    let stub: sinon.SinonSpy;

    beforeEach(() => {
      stub = sinon.stub(AlDefaultClient as any, 'axiosRequest').returns(Promise.resolve({ status: 200, data: { }}));
    });

    afterEach(() => {
      stub.restore();
    });

    it('should call the AlDefaultClient instance\'s GET.', async() => {
      await AlMsgAccessClient.readMessagesGET(accountId, undefined, { ids: '123' });
      expect(stub.callCount).to.equal(1);
      expect(stub.args[0][0].url).to.contains("/msg_access/v1/2/messages/logmsgs");
    });
  });
});
