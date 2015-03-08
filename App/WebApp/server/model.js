var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var LedColorSchema = new Schema({
	name: String,
	r: Number,
	g: Number,
	b: Number,
	hex: String,
	timestamp : {type : Date, default: Date.now }

});

var LedColorModel = mongoose.model('LEDColor', LedColorSchema);

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

module.exports.model = LedColorModel;
module.exports.rgbToHex = rgbToHex;