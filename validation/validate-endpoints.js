var _ = require('lodash');

module.exports = function( endpoints ) {
	var validator = {};

	validator._endpointValidators = {
		'description': _.isString,
		'url' : _.isString,
		'requiredFields': _.isObject,
		'optionalFields': _.isObject,
		'function': _.isFunction
	};

	validator._fieldValidators = {
		'type': _.isString,
		'description': _.isString
	};

	validator._validateField = function _validateField( field, name ){
		return _.map( validator._fieldValidators, function( validator, property ) {
			return validator( field[property] ) ? '' : 'Invalid value for the ' + property + ' property of field ' + name;
		} );
	};

	validator._validateEndpoint = function _validateEndpoint( endpoint, name ) {
		return _.map( validator._endpointValidators, function( validator, property ) {
			var fieldMessages = _.extend(
				_.map( endpoint.optionalFields, validator._validateField ),
				_.map( endpoint.requiredFields, validator._validateField )
			);
			return _.extend(
				fieldMessages,
				[validator( endpoint[property] ) ? '' : 'Invalid value for the ' + property + ' property of endpoint ' + name]
			);
		} );
	};

	validator.validateEndpoints =  _.filter( _.flattenDeep( _.map( endpoints, this.validateEndpoint ) ), _.negate( _.isEmpty ) );

	return validator;
};
