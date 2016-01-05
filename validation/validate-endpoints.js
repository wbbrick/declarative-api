var _ = require('lodash');

module.exports = function() {
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
		return _.map( validator._fieldValidators, function( fieldValidator, property ) {
			return fieldValidator( field[property] ) ? '' : 'Invalid value for the ' + property + ' property of field ' + name;
		} );
	};

	validator._validateEndpoint = function _validateEndpoint( endpoint, name ) {
		return _.map( validator._endpointValidators, function( endpointValidator, property ) {
			var fieldMessages = _.extend(
				_.map( endpoint.optionalFields, validator._validateField ),
				_.map( endpoint.requiredFields, validator._validateField )
			);
			return _.extend(
				fieldMessages,
				[endpointValidator( endpoint[property] ) ? '' : 'Invalid value for the ' + property + ' property of endpoint ' + name]
			);
		} );
	};

	validator.validateEndpoints =  function( endpoints ) {
		return _.filter( _.flattenDeep( _.map( endpoints, validator._validateEndpoint ) ), _.negate( _.isEmpty ) );
	};

	return validator;
}();
