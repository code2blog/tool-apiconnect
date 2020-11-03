var apic = require('./apim.custom.js');
// use apim.getvariable('request.body') to fetch soap response from weather service
// navigate through xml-nodelist, xml-element, to get textContent from xml = <dwml><latLonList>42.8018,-73.9281</latLonList></dwml>"
// use XML.parse() to convert textContent to xml objects
// navigate xml-document, xml-element to get string value of latitude and longitude = 42.8018,-73.9281


var gwVar = {};
gwVar.log = [];

function findInNodeList(nodeList, name){
	var foundTheseNames = [];
	for (var i = 0; i < nodeList.length; i++){
		var node = nodeList.item(i);
		var foundThisName = node.localName;
		gwVar.log.push('findInNodeList-'+foundThisName);
		foundTheseNames.push(foundThisName);
		if(name == foundThisName){
			return node;
		}	
	}
	return foundTheseNames;
}

// 'request.body.Envelope.Body.LatLonListZipCodeResponse.listLatLonOut'
var forCodeReadability = findInNodeList(apim.getvariable('request.body'), 'Envelope');
gwVar.log.push('findInNodeList-Result-'+forCodeReadability);

// node type = element 
forCodeReadability = findInNodeList(forCodeReadability.childNodes, 'Body');
forCodeReadability = findInNodeList(forCodeReadability.childNodes, 'LatLonListZipCodeResponse');
forCodeReadability = findInNodeList(forCodeReadability.childNodes, 'listLatLonOut');

// node type = document
forCodeReadability = findInNodeList(XML.parse(forCodeReadability.textContent).childNodes, 'dwml');

// node type = element 
forCodeReadability = findInNodeList(forCodeReadability.childNodes, 'latLonList');

gwVar.xmlString = forCodeReadability.textContent;

apim.setvariable('message.headers.content-type', 'application/json', 'set');
gwVar.log = null;
apim.setvariable('message.body', JSON.stringify(gwVar), 'set');

