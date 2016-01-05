var request = new XMLHttpRequest();
request.open('GET', '/endpoints', true);

function getObjectLength( obj ) {
	var count = 0;
	for ( var i in obj ) {
		if ( obj.hasOwnProperty( i ) ) {
			count++;
		}
	}
	return count;
}

function formatData( endpoints ) {
	var html = '<h1>Endpoint Documentation</h1>';
	for( var endpoint in endpoints ) {
		var endpointData = endpoints[endpoint];
		html += '<h2>' + endpoint + '</h2>';
		html += '<div class="endpoint-block">'; //start endpoint-block
		html += '<div class="description"><span class="label">Description:</span> ' + endpointData.description + '</div>';
		html +=
			'<div class="description"><span class="label">Url:</span> ' +
			'<a href="' + endpointData.url + '">' + endpointData.url + "</a>" +
			'</div>';
		if( getObjectLength( endpointData.requiredFields ) > 0 ) {
			html += '<h3>Required Fields</h3>';
			for( var requiredField in endpointData.requiredFields ) {
				html += '<div class="label">' + requiredField + '</div>';
				html += '<div class="field-block">'; //start field-block;
				html += '<div><span class="label">Type:</span> ' + endpointData.requiredFields[requiredField].type + '</div>';
				html += '<div><span class="label">Description:</span> ' + endpointData.requiredFields[requiredField].description + '</div>';
				html += '</div>'; //end field-block
			}
		}
		if( getObjectLength( endpointData.optionalFields ) > 0 ) {
			html += '<h3>Optional Fields</h3>';
			for( var optionalField in endpointData.optionalFields ) {
				html += '<div class="label">' + requiredField + '</div>';
				html += '<div class="field-block">'; //start field-block
				html += '<div><span class="label">Type:</span> ' + endpointData.optionalFields[optionalField].type + '</div>';
				html += '<div><span class="label">Description:</span> ' + endpointData.optionalFields[optionalField].description + '</div>';
				html += '</div>'; //end field-block
			}
		}
		html += "</div>"; //end endpoint-block
	}
	return html;
}

request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
		var data = JSON.parse(request.responseText);
		document.getElementById( 'content' ).innerHTML = formatData( data );
	} else {
		document.getElementById( 'error' ).value = 'Malformed or unavailable endpoint list';
	}
};

request.onerror = function() {
	document.getElementById( 'error' ).value = 'Connection Error';
};

request.send();
