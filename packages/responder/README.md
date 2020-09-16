@al/responder
=========

A lightweight client library for interacting with the Responder API.

This library uses @al/responder as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/responder --save

## Usage

      var ResponderClient = require('@al/responder').ResponderClient; //commonjs - e.g. node
      import { ResponderClient } from '@al/responder'; //ES2015 - e.g. Angular, TS projects

## Interactive

## Tests

      npm test

## Contributing

The sources are written in Typescript and follow the tslint airbnb style.

## Building

To generate a build

    npm run build

Builds will be be generated into a `dist` folder and will contain commonjs and umd bundles that will be consumed depending on the module system in whichever environment you are using.
