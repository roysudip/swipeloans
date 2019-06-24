/**
 * covert canvas to image
 * and save the image file
 */

	// check if support sth.
	var $support = function () {
		var canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		return {
			canvas: !!ctx,
			imageData: !!ctx.getImageData,
			dataURL: !!canvas.toDataURL,
			btoa: !!window.btoa
		};
	}();

	var downloadMime = 'image/octet-stream';

	function scaleCanvas (canvas, width, height) {
		var w = canvas.width,
			h = canvas.height;
		if (width == undefined) {
			width = w;
		}
		if (height == undefined) {
			height = h;
		}

		var retCanvas = document.createElement('canvas');
		var retCtx = retCanvas.getContext('2d');
		retCanvas.width = width;
		retCanvas.height = height;
		retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
		return retCanvas;
	}

	function getDataURL (canvas, type, width, height) {
		canvas = scaleCanvas(canvas, width, height);
		return canvas.toDataURL(type);
	}

	// function saveFile (strData) {
	// 	document.location.href = strData;
	// }

	function saveFile(uri, filename = 'default.png') {
		var link = document.createElement('a');
		if (typeof link.download === 'string') {
			document.body.appendChild(link); // Firefox requires the link to be in the body
			link.download = filename;
			link.href = uri;
			link.click();
			document.body.removeChild(link); // remove the link when done
		} else {
			location.replace(uri);
		}
	}

	function fixType (type) {
		type = type.toLowerCase().replace(/jpg/i, 'jpeg');
		var r = type.match(/png|jpeg|gif/)[0];
		return 'image/' + r;
	}


	/**
	 * saveAsImage
	 * @param canvasElement
	 * @param {String} image type
	 * @param {Number} [optional] png width
	 * @param {Number} [optional] png height
	 */
	var saveAsImage = function (canvas, width, height, type,filename) {
		if ($support.canvas && $support.dataURL) {
			if (typeof canvas == "string") { canvas = document.getElementById(canvas); }
			if (type == undefined) { type = 'png'; }
			var extension = type
			type = fixType(type);
			var strData = getDataURL(canvas, type, width, height);
			saveFile(strData.replace(type, downloadMime),filename+'.'+extension);
		}
	};


export default {
	saveAsImage: saveAsImage,
	saveAsPNG: function (canvas, filename, width, height) {
		return saveAsImage(canvas, width, height, 'png', filename);
	},
	saveAsJPEG: function (canvas, filename, width, height) {
		return saveAsImage(canvas, width, height, 'jpeg', filename);
	},
	saveAsGIF: function (canvas, filename, width, height) {
		return saveAsImage(canvas, width, height, 'gif', filename);
	},
};
