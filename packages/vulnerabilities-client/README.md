  @al/vulnerabilities
=========

A client for working with the Vulnerabilities Alert Logic API.


## Installation

      npm install @al/vulnerabilities --save

## Usage

      var VulnerabilitiesClient = require('@al/vulnerabilities').AlVulnerabilitiesClient; //commonjs - e.g. node
      import { AlVulnerabilitiesClient } from '@al/vulnerabilities'; //ES2015 - e.g. Angular, TS projects

  Get Remediation

    AlVulnerabilitiesClient.getRemediation(accountId, remediationId)
      accountId: '1234'
      remediationId: '1234' 

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
