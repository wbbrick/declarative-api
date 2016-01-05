var expect    = require("chai").expect;
var endpointValidator = require("../validation/validate-endpoints.js");

var fieldWithoutType = {
	'description' : 'A test field.'
};
var fieldWithBadType = {
	'description' : 'A test field.',
	'type': 5
};
var fieldWithoutDescription = {
	'type': 'string'
};
var fieldWithBadDescription = {
	'description': 5
};
var validField = {
	'description': 'A test field',
	'type': 'string'
};

describe("Endpoint Validator", function() {
	describe("Field Validation", function() {
		it("Rejects fields without types", function() {
			expect( endpointValidator._validateField( fieldWithoutType ) ).not.to.equal('');
		});
		it("Rejects fields with bad types", function() {
			expect( endpointValidator._validateField( fieldWithBadType ) ).not.to.equal('');
		});
		it("Rejects fields without descriptions", function() {
			expect( endpointValidator._validateField( fieldWithoutDescription ) ).not.to.equal('');
		});
		it("Rejects fields with bad descriptions", function() {
			expect( endpointValidator._validateField( fieldWithBadDescription ) ).not.to.equal('');
		});
		it("Accepts fields with valid types and descriptions", function() {
			expect( endpointValidator._validateField( validField ).join('') ).to.equal('');
		});
	});
});
