var express = require('express');
var _ = require('lodash');
var url = require('url');
var validator = require('./validation/validate-endpoints.js');
var bodyParser = require('body-parser');

module.exports = function( options ) {
	var app = express();

	function fieldsMatch( required, provided ) {
		return _.intersection( required, provided ).length === required.length;
	}

	this.start = function( endpoints ) {
		var errors = validator.validateEndpoints( endpoints );
		if( !_.isEmpty( errors ) ) {
			console.log( errors.join( '\n' ) );
		} else {
			app.use( bodyParser.json() ); // support json encoded bodies
			app.use( bodyParser.urlencoded( { extended: true } ) ); // support encoded bodies

			var server = app.listen(options.port, options.host, function () {
				var host = server.address().address;
				var port = server.address().port;

				console.log('Listening at http://%s:%s', host, port);
			});

			//serve the documentation folder statically
			app.use( '/', express.static( __dirname + '/documentation' ) );

			//serve up the endpoint information as JSON
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

				app.post(endpoint.url, function( req, res ) {
					try {
						var requiredFields = endpoint.requiredFields;
						var optionalFields = endpoint.optionalFields;
						var payload = {};
						if( fieldsMatch( _.keys( requiredFields ), _.keys( req.body ) ) ) {
							_.each( requiredFields, function( data, field ) {
								if( data.type === "Object" ) {
									payload[field] = JSON.parse( req.body[field.toLowerCase()] );
								} else {
									payload[field] = req.body[field.toLowerCase()];
								}
							} );
							_.each( optionalFields, function( data, field ) {
								if( payload[field] && data.type === "Object" ) {
									payload[field] = JSON.parse( req.body[field.toLowerCase()] );
								} else if ( payload[field] && data.type !== "Object" ) {
									payload[field] = req.body[field.toLowerCase()];
								} else {
									payload[field] = data.default;
								}
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
	};
	return this;
};
