var endpoint = require('./server');

var server = endpoint( {
		'port': '3000',
		'host': '127.0.0.1'
} );

var endpoints = {
		'Square' : {
				'description': 'Square a number.',
				'url' : '/square',
				'requiredFields' : {
						'num' :
						{
								'type': 'Number',
								'Description': 'The number to be squared.'
						}
				},
				'optionsFields': {},
				'function' : function( payload ) { return payload.num * payload.num; }
		},
		'Add' : {
				'description': 'Add two numbers',
				'url': '/add',
				'requiredFields' : {
						'num1' : {
								'type': 'Number',
								'description': 'The first number to be added.'
						},
						'num2' : {
								'type': 'Number',
								'description': 'The seconds number to be added'
						}
				},
				'optionsFields': {},
				'function' : function( payload ) { return parseInt( payload.num1 ) + parseInt( payload.num2 ); }
		}
};

server.start( endpoints );
