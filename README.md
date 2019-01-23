  @alertlogic/credentials
=========

A client for interacting with the Alert Logic Credentials Public API.

This library uses @alertlogic/client as its HTTP provider interface.

## Installation

      npm install @alertlogic/credentials --save

## Usage

      var CredentialsClient = require('@alertlogicalertlogic/credentials')

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

## Tests

      npm test

## Linting

      npm run lint

## Contributing

This repository follows the eslint airbnb style.

## Release History

* 0.1.0 Initial release
