  @al/ticketmaster
=========

A client for working with the Analytics Engine Correlations Alert Logic API.

This library uses @al/ticketmaster as its HTTP provider interface.

## Disclaimer

Until the release of version 1.0.0 all current minor version increments may be backwards incompatible. Please bear this in mind when developing against this library. Should you have any further questions, please do not hesitate to contact us as [npm@alertlogic.com](mailto:npm@alertlogic.com)

## Installation

      npm install @al/ticketmaster --save

## Usage

      var AlTicketMasterClient = require('@al/ticketmaster').AlTicketMasterClient; //commonjs - e.g. node
      import { AlTicketMasterClient } from "@al/ticketmaster"; //ES2015 - e.g. Angular, TS projects

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
