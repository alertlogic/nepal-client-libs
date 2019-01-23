  @alertlogic/environments
=========

A client for interacting with the Alert Logic Environments Public API.

This library uses @alertlogic/client as its HTTP provider interface.

## Installation

      npm install @alertlogic/environments --save

## Usage

      var EnvironmentsClient = require('@alertlogic/environments')

  Add Environment

      EnvironmentsClient.addEnvironment(accountId, environment)
        accountId: '1234',
        environment: '{"type":"aws", "type_id": "123456789012", "defender_support":true, "defender_location_id":"defender-us-denver", "discover":true, "scan":false}'
  
  Delete Environment

      EnvironmentsClient.deleteEnvironment(accountId, environmentId)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE'
  
  Get Environment

      EnvironmentsClient.getEnvironment(accountId, environmentId, queryParams)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        queryParams: {
          type: 'aws',
          type_id: ,
          defender_support: true|false,
          discover: true|false,
          scan: true|false,
          mode: 'automatic|guided|readonly|none',
          deleted_since: ,
        }
  
  Get accounts with environments
  
      EnvironmentsClient.getAccounts(accountId)
        accountId: '1234'
        queryParams: {
          type: 'aws',
          type_id: ,
          defender_support: true|false,
          discover: true|false,
          scan: true|false,
          mode: 'automatic|guided|readonly|none',
          deleted_since: ,
        }
  
  Get Environments

      EnvironmentsClient.getEnvironments(accountId, queryParams)
        accountId: '1234'
        queryParams: {
          type: 'aws',
          type_id: ,
          defender_support: true|false,
          discover: true|false,
          scan: true|false,
          mode: 'automatic|guided|readonly|none',
          deleted_since: ,
        }
  
  Update Environment

      EnvironmentsClient.updateEnvironment(accountId, environmentId, environment)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        environment: '{"name":"environment5", "credential_id": "77C12B2C-8340-4AFD-AB25-4D0581443A5E", "scope": { "include": [{"type": "vpc", "key": "/aws/us-east-1/vpc/vpc-1234"}], "exclude": [{"type": "subnet","key": "/aws/us-east-1/subnet/subnet-35f42c6c"}]}, "enabled":true}'
  
  Update Environment Status

      EnvironmentsClient.updateEnvironmentStatus(accountId, environmentId, status)
        accountId: '1234',
        environmentId: 'UUID-GOES-HERE',
        status: '{"status":"ok", "timestamp": 1471277293, "details":"status is ok now"}'

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
