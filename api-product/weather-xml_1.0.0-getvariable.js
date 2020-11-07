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

try {
	gwVar.debug = {};
	gwVar.debug.body = apim.getvariable('message.body');
	
	var parsedXml = XML.parse(gwVar.debug.body.result).childNodes; 
	// node type = document
	var forCodeReadability = findInNodeList(parsedXml, 'dwml');
	
	// node type = element 
	forCodeReadability = findInNodeList(forCodeReadability.childNodes, 'latLonList');
	gwVar.latLon = forCodeReadability.textContent;
	
	delete gwVar.log;
	delete gwVar.debug;
} catch(err) {
    gwVar.err = err;
}

apim.setvariable('message.headers.content-type', 'application/json', 'set');
apim.setvariable('message.body', JSON.stringify(gwVar), 'set');


