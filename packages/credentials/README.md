  @al/credentials
=========

A client for interacting with the Alert Logic Credentials Public API.

This library uses @al/core as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/credentials --save

## Usage

      var CredentialsClient = require('@al/credentials').CredentialsClient //commonjs - e.g. node
      import { CredentialsClient } from '@al/credentials'; //ES2015 - e.g. Angular, TS projects

  Delete Credentials

      CredentialsClient.deleteCredentials(accountId, environmentId, assetType, credentialType, assetKey)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        assetType: 'region| vpc | subnet | host',
        credentialType: 'ssh | windows',
        assetKey: 'aws/us-west-2/host/i-4e751943'
  
  Get Host Credentials

      CredentialsClient.getHostCredentials(accountId, environmentId, assetKey)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        assetKey: 'aws/us-west-2/host/i-4e751943'
  
  Get all scan credentials for all hosts

      CredentialsClient.getAllHostCredentials(accountId, environmentId)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
  
  Store credentials for an asset

      CredentialsClient.storeCredential(accountId, environmentId, assetType, assetKey, credential)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        assetType: 'region| vpc | subnet | host',
        assetKey: 'aws/us-west-2/host/i-4e751943',
        credential: '{"name": "SSH Key", "type": "ssh", "sub_type": "key", "username": "alertlogic", "key": "-----KEY-----\nMII…"}'
  
  Create credential

      CredentialsClient.createCredential(accountId, credential)
        accountId: '1234',
        credential: '{"name": "SSH Key", "type": "ssh", "sub_type": "key", "username": "alertlogic", "key": "-----KEY-----\nMII…"}'
  
  Delete credential

      CredentialsClient.deleteCredential(accountId, credentialId)
        accountId: '1234',
        credentialId: 'UUID-GOES-HERE'
  
  Get a specific credential

      CredentialsClient.getCredentialById(accountId, credentialId)
        accountId: '1234',
        credentialId: 'UUID-GOES-HERE'
  
  Get all credentials

      CredentialsClient.listCredentials(accountId)
        accountId: '1234'

## Interactive

  Loads the library into memory and stays in an interactive node shell.
  
      npm run interactive

  NOTE - You must build the sources before running this command, see Building section below

## Tests

      npm test

## Contributing

The sources are written in Typescript and follow the tslint airbnb style.

## Building

To generate a production build

    npm run build

To generate a development build

    npm run build-dev

Builds will be be generated into a `dist` folder and will contain commonjs and umd bundles that will be consumed depending on the module system in whichever environment you are using.
