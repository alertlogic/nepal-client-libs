@al/connectors
=========

A lightweight client library for interacting with the Integrations API.

This library uses @al/connectors as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/connectors --save

## Usage

      var ConnectorsClient = require('@al/connectors').ConnectorsClient; //commonjs - e.g. node
      import { ConnectorsClient } from '@al/connectors'; //ES2015 - e.g. Angular, TS projects

## Interactive

## Tests

      npm test

## Contributing

The sources are written in Typescript and follow the tslint airbnb style.

## Building

To generate a build

    npm run build

Builds will be be generated into a `dist` folder and will contain commonjs and umd bundles that will be consumed depending on the module system in whichever environment you are using.
