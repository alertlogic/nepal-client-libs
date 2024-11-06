module.exports = function( config ) {
    var sharedConfig = require( "../../karma.shared.config.js" );
    sharedConfig( config, "blocking-action" );
}