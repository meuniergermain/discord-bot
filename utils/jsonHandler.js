const fs = require('fs');

// Ask for an object and filename and write to a JSON file in /data
function writeJSONfile(data, filename) {
	// Convert object to JSON string
	const jsonString = JSON.stringify(data, null, 2);
	const path = `./data/${filename}.json`;
	// Write JSON string to a file
	fs.writeFile(path, jsonString, 'utf8', (err) => {
		if (err) {
			console.error('Error writing JSON to file:', err);
		} else {
			console.log('JSON data written to file successfully');
		}
	});
}

// Ask for an  filename and read the associated JSON file in /data
function readJSONfile(filename) {
	try {
		const path = `./data/${filename}.json`;
		const data = fs.readFileSync(path, 'utf8');
		const jsonObject = JSON.parse(data);
		//console.log('JSON Object:', jsonObject);
		return jsonObject;
	} catch (error) {
		console.error('Error reading or parsing JSON file:', error);
		throw error;
	}
}

module.exports = {
	writeJSONfile: writeJSONfile,
	readJSONfile: readJSONfile,
};