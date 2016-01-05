var _ = require('lodash');

var endpointValidators = {
	'description': _.isString,
	'url' : _.isString,
	'requiredFields': _.isObject,
	'optionalFields': _.isObject,
	'function': _.isFunction
};

var fieldValidators = {
	'type': _.isString,
	'description': _.isString
};

function validateField( field, name ){
	return _.map( fieldValidators, function( validator, property ) {
		return validator( field[property] ) ? '' : 'Invalid value for the ' + property + ' property of field ' + name;
	} );
}

function validateEndpoint( endpoint, name ) {
	return _.map( endpointValidators, function( validator, property ) {
		var fieldMessages = _.extend(
			_.map( endpoint.optionalFields, validateField ),
			_.map( endpoint.requiredFields, validateField )
		);
		return _.extend(
			fieldMessages,
			[validator( endpoint[property] ) ? '' : 'Invalid value for the ' + property + ' property of endpoint ' + name]
		);
	} );
}

module.exports = function( endpoints ) {
	return _.filter( _.flattenDeep( _.map( endpoints, validateEndpoint ) ), _.negate( _.isEmpty ) );
};
