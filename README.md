  @alertlogic/aims
=========

A client for working with the AIMS Alert Logic API.

This library uses @alertlogic/client as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @alertlogic/aims --save

## Usage

      var AIMSClient = require('@alertlogic/aims').AIMSClient; //commonjs - e.g. node
      import { AIMSClient } from '@alertlogic/aims'; //ES2015 - e.g. Angular, TS projects

  Get Account Details

    AIMSClient.getAccountDetails(accountId)
      accountId: '1234'
  
  Get Managed Accounts

    AIMSClient.getManagedAccounts(accountId, queryParams)
      accountId: '1234'
      queryParams: {
        active: true,
        relationship: 'bills_to|managed|managing'
      }

  Enbale or disabled MFA requirement on account

    AIMSClient.requireMFA(accountId, bool)
      accountId: '1234',
      bool: true|false
  
  Authenticate a user

    AIMSClient.authenticate(params, username, password, mfa_code);
      params: {
        service_name: 'aims',
        path: '/authenticate'
      },
      username: 'bob@email.com',
      password: 'IAmNotAValidUser!@#$',
      mfa_code: '123456'
  
  Change a users password

    AIMSClient.changePassword(email, password, newPassword)
      email: 'bob@email.com',
      password: IAmNotAValidUser!@#$',
      newPassword: 'ANewPasswordOfMyChoosing'
  
  Reconstitute a logged in users identity from their AIMS Token

    AIMClient.tokenInfo()
  
  Initiate a password reset

    AIMSClient.initiateReset(email, returnTo)
      email: 'bob@email.com'',
      returnTo: 'https://URLForLoginPurposes'
  
  Complete a password reset

    AIMSClient.resetWithToken(token, password)
      token: 'ProvidedInEmail',
      password: 'ANewPasswordOfMyChoosing'
  
  Create a role

    AIMSClient.createRole(accountId, name, permissions)
      accountId: '1234',
      name: 'This Is My New Role',
      permissions: '{"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}'
  
  Delete a role

    AIMSClient.deleteRole(accountId, roleId)
      accountId: '1234',
      roleId: 'UUID-GOES-HERE'
  
  Get Global Role

    AIMSClient.getGlobalRole(roleId)
      roleId: 'UUID-GOES-HERE'
  
  Get Account Role

    AIMSClient.getAccountRole(accountId, roleId)
      accountId: '1234',
      roleId: 'UUID-GOES-HERE'
  
  Get all Global Roles

    AIMSClient.getGlobalRoles()
  
  Get all Account Roles
  
    AIMSClient.getAccountRoles(accountId)
      accountId: '1234'
  
  Update a Role

    AIMSClient.updateRole(accountId, name, permissions)
      accountId: '1234',
      name: 'The New Role Name',
      permissions: '{"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}'
  
  Update a Role Name

    AIMSClient.updateRole(accountId, name)
      accountId: '1234',
      name: 'The New Role Name',
  
  Update Role Permissions

    AIMSClient.updateRole(accountId, permissions)
      accountId: '1234',
      permissions: '{"*:own:*:*": "allowed", "aims:own:grant:*":"allowed"}'
  
  Enroll a Users MFA Device

    AIMSClient.enrollMFA(uri, codes)
      uri: 'otpauth://totp/Alert%20Logic:admin@company.com?secret=GFZSA5CINFJSA4ZTNNZDG5BAKM2EMMZ7&issuer=Alert%20Logic&algorithm=SHA1',
      codes: ["123456", "456789"]
  
  Remove a Users MFA Device

    AIMSClient.deleteMFA(email)
      email: 'bob@email.com'
        

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
