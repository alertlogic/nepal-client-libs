@al/collector-status
=========

A lightweight client library for interacting with the Collector Status API.

This library uses @al/collector-status as its HTTP provider interface.
you can handle actions task and the workflow.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/collector-status --save

## Usage

      var AlCollectorStatusClient = require('@al/collector-status').AlCollectorStatusClient; //commonjs - e.g. node
      import { AlCollectorStatusClient } from '@al/collector-status'; //ES2015 - e.g. Angular, TS projects

## Interactive

## Tests

      npm test

## Contributing

The sources are written in Typescript and follow the tslint airbnb style.

## Building

To generate a build

    npm run build

Builds will be be generated into a `dist` folder and will contain commonjs and umd bundles that will be consumed depending on the module system in whichever environment you are using.
