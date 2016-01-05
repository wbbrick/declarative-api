var express = require('express');
var _ = require('lodash');
var url = require('url');

module.exports = function( options ) {
		var app = express();

		app.get('/', function (req, res) {
				res.send('Hello World!');
		});

		function fieldsMatch( required, provided ) {
				return _.intersection( required, provided ).length === required.length;
		}

		this.start = function( endpoints ) {
				var server = app.listen(options.port, options.host, function () {
						var host = server.address().address;
						var port = server.address().port;

						console.log('Listening at http://%s:%s', host, port);
				});

				app.get( '/endpoints', function( req, res ) {
						res.send( _.omit( endpoints, 'function' ) );
				} );
				//listen to each endpoint as specified by the user
				_.each( endpoints, function( endpoint, name ) {
						app.get(endpoint.url, function( req, res ) {
								try {
										var requiredFields = endpoint.requiredFields;
										var optionalFields = endpoint.optionalFields;
										var query = url.parse( req.url, true ).query;
										var payload = {};
										if( fieldsMatch( _.keys( requiredFields ), _.keys( query ) ) ) {
												payload = query;
										} else if( fieldsMatch( _.keys( requiredFields ), _.keys( req.headers ) ) ) {
												_.each( _.keys( requiredFields ), function( field ) {
														payload[field] = req.headers[field.toLowerCase()];
												} );
												_.each( _.keys( optionalFields ), function( field ) {
														payload[field] = req.headers[field.toLowerCase()] || null;
												} );
										} else {
												var error = 'A request must have a the following valid fields: ' +
																_.keys( requiredFields ).join( ', ' ) + '.';
												res.send( {'result' : error } );
												return;
										}
										var result = endpoint['function']( payload );
										res.send( { 'result' : result } );
								} catch( ex ) {
										res.send( { 'result' : 'A server error occurred: ' + ex.message } );
								}
						}.bind( this ) );

				}, this );

		};

		return this;
};
