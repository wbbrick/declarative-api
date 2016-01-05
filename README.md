# Easy Endpoint

```
var easyEndpoint = require('./server');

var server = easyEndpoint( {
	'port': '3000',
	'host': '127.0.0.1'
} );

var endpoint = {
	'Hello World' : {
		'description': 'Hello World!',
		'url' : '/hw',
		'requiredFields' : {},
		'optionalFields': {},
		'function' : function() { return 'Hello World!'; }
	}
};

server.start( endpoint );
```

Easy Endpoint is a library for quickly setting up a self-documenting REST endpoint declaratively.  It is built on top of [Express](http://expressjs.com/).  Please note the project is still in alpha - expect more updates to come soon, some potentially backwards-incompatible.  Easy Endpoint is designed to be fast and lightweight, but not terribly flexible - the idea is to quickly and easily expose any node library or API via a REST endpoint or set of endpoints.

## Installation

As Easy Endpoint is still in alpha, there is no npm package for it yet.  However, you can easily add it to your node project with the following command:

```
npm install git+git@github.com:wbbrick/easy-endpoint.git --save
```

## Quick Start

Once you've installed the library, open up main.js and require it like so:

```
var easyEndpoint = require('easy-endpoint');
```

From there, initialize a web server with the port and host specified as options:

```
var server = easyEndpoint( {
	host: '127.0.0.1',
	port: '3000'
} );
```

After that, just call server.start() with the endpoints specified

```

server.start( {
	'Square' : {
		'description': 'Square a number.',
		'url' : '/square',
		'requiredFields' : {
			'num' :
			{
				'type': 'Number',
				'description': 'The number to be squared.'
			}
		},
		'optionalFields': {},
		'function' : function( payload ) { return payload.num * payload.num; }
	} );
```

This will create server with two paths.  The path "/square" that takes a single argument, "num" (via GET, POST, or query string parameter) and returns the same number squared.  The base path provides a documentation for the API taken from the endpoint specification.

## Required Endpoint Properties

When you start the server, you feed it an object consisting of a series of named endpoints.  There are five (case-sensitive) properties that must be part of this object.

### description

This is a short description of the endpoint's functionality. It will appear in the auto-generated documentation.

### url

This is the route that the server will serve the endpoint from.

### requiredFields

This is a list of required fields.  If a request is made to the endpoint without any of these, the server will return an error statemtent.  This can be empty.

### optionalFields

This is a list of optional fields.  It is best to define default values for these in the function property.  Like the required fields, this can be empty.

### functionality

This is the function that is run when the endpoint is hit.  It takes all of the input (required and optional), performs a computation on the server, and returns the result as a JSON object.

## Required Field Properties

Each field listed, whether required or optional, must have the following properties:

### type

This is the type of the field.  In future releases, this will be used to validate request inputs

### description

This is a description of the field.  It will appear in the auto-generated documentation.

## Caveats

- Two routes are reserved, the base route ('/') and a route for serving up the endpoint information ('/endpoints').  If you attempt to use either of these routes as an endpoint, the app will fail.
- This is still very much a work in progress, so expect bugs and gaps in functionality.  Any comments, issues, or pull requests are welcome!

### TODOS

- Validate request input by type
- Provide more configuration options
- Write tests
- Provide examples
