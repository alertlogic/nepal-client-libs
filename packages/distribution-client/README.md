@al/distributor
=========

A lightweight client library for interacting with the Distributor API.

This library uses @al/distributor as its HTTP provider interface.
you can handle actions task and the workflow.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/distributor --save

## Usage

      var DistributorClient = require('@al/distributor').DistributorClient; //commonjs - e.g. node
      import { DistributorClient } from '@al/distributor'; //ES2015 - e.g. Angular, TS projects

## Interactive

## Tests

      npm test

## Contributing

The sources are written in Typescript and follow the tslint airbnb style.

## Building

To generate a build

    npm run build

Builds will be be generated into a `dist` folder and will contain commonjs and umd bundles that will be consumed depending on the module system in whichever environment you are using.
