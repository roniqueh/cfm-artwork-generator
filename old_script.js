let html5Canvas = document.getElementById("canvas");
const CANVASSIZE = html5Canvas.width;
const MARGIN = 40;
const YBASE = MARGIN;
const TEXTWIDTH = 830;
const LINEHEIGHT = 0.915;
const CHARSPACING = -50;
const LINKWIDTH = 195;
const CHUNT0DATE = new Date("2022-03-14");

// Create colour pickers
const backgroundColourPicker = Spectrum.getInstance('#background-colour', {
	type: "color",
	showInput: true,
	showButtons: false,
	allowEmpty: false,
});

const accentColourPicker = Spectrum.getInstance('#accent-colour', {
	type: "color",
	showInput: true,
	showButtons: false,
	allowEmpty: false,
});

const textBackgroundColourPicker = Spectrum.getInstance('#text-background-colour', {
	type: "color",
	showInput: true,
	showButtons: false,
	allowEmpty: true,
	color: "transparent",
});

const overlayColourPicker = Spectrum.getInstance('#overlay-colour', {
	type: "color",
	showInput: true,
	showButtons: false,
	allowEmpty: true,
	color: "transparent",
});

// Resize HTML5 Canvas to fit parent wrapper (size controlled by CSS)
html5Canvas.style.width = "100%";
html5Canvas.style.height = "100%";

// Square aspect ratio, so just use clientWidth for size
let displaySize = html5Canvas.clientWidth;
let scaleFactor = displaySize / CANVASSIZE;

const canvas = new fabric.Canvas('canvas', {
	preserveObjectStacking: true,
	// backgroundColor: "white",
});
canvas.hoverCursor = 'pointer';

// Wait for initial font load
document.fonts.ready.then(() => {
	drawCanvas()
})

function drawCanvas() {
	// Initialise variables
	let showName = document.getElementById("show-name").value;
	let showHost = document.getElementById("show-host").value;
	let showDate = new Date(document.getElementById("show-date").value || Date());
	let textPosition = document.getElementById("text-position").value = 0;
	// Following two require the fabric.Textbox of showName and showHost to be created first => set textPosition to 0 above
	let maxYOffset;
	let yOffset;
	let chuntDays = Math.floor((showDate - CHUNT0DATE) / (1000 * 3600 * 24));
	let backgroundColour = backgroundColourPicker.get().toRgbString();
	let accentColour = accentColourPicker.get().toRgbString();
	let textBackgroundColour = textBackgroundColourPicker.get().toRgbString();
	let overlayColour = overlayColourPicker.get().toRgbString();
	let showImg = new Image();
	let imgSizing = document.querySelector("[name='img-sizing']:checked").id;
	let textBool = document.getElementById("ge1")['checked'];
	let logoBool = document.getElementById("ge2")['checked'];
	let counterBool = document.getElementById("ge3")['checked'];
	let linkBool = document.getElementById("ge4")['checked'];

	canvas.setBackgroundColor(backgroundColour);
	canvas.renderAll();

	// Helper functions
	function getObjectById(id) {
		for (let i = 0; i < canvas.getObjects().length; i++) {
			let object = canvas.getObjects()[i]
			if (object.id === id) {
				return object
			} else return null
		}
	}

	function positionText() {
		maxYOffset = CANVASSIZE - (4 * MARGIN) - showNameText.height - showHostText.height
		yOffset = (+textPosition / 100) * maxYOffset
		showNameText.set({
			top: YBASE + yOffset
		})
		showHostText.set({
			top: YBASE + yOffset + showNameText.height - 6
		})
	}

	function setSVGColour(id, color) {
		let SVGObject = getObjectById(id);
		if (typeof SVGObject._objects !== "undefined") {
			SVGObject.set({ fill: color })
			for (let j = 0; j < SVGObject._objects.length; j++) {
				let SVGObjectPath = SVGObject._objects[j]
				SVGObjectPath.set({ fill: color })
			}
		} else {
			SVGObject.set({ fill: color })
		}
	}

	function setSVGVisibility(id, visibility) {
		let SVGObject = getObjectById(id);
		SVGObject.set({ visible: visibility })
	}

	function setImageToBackground(img, imgSizing) {
		if (getObjectById("background-image")) {
			canvas.remove(getObjectById("background-image"))
			canvas.renderAll()
		}
		let scaleRatio;
		let heightRatio = CANVASSIZE / img.height;
		let widthRatio = CANVASSIZE / img.width;
		switch (imgSizing) {
			case 'img-cover':
				// Scale fixed to scaleRatio + translation allowed only in direction of remaining image
				scaleRatio = Math.max(widthRatio, heightRatio);
				img.set({
					minScaleLimit: scaleRatio,

				})
				if (widthRatio > heightRatio) {
					// Width is limiting factor
					img.set({ lockMovementX: true })
				} else {
					// Height is limiting factor
					img.set({ lockMovementY: true })
				}
				img.set({ hasControls: false })
				// Top and left of image reference position of center of image wrt canvas

				img.on('moving', function() {
					let actualWidth = img.width * img.scaleX
					let actualHeight = img.height * img.scaleY

					// Restrict movement to the left
					if (img.left + (actualWidth / 2) < CANVASSIZE) {
						this.set('left', CANVASSIZE - (actualWidth / 2));
					}

					// Restrict movement to the top
					if (img.top + (actualHeight / 2) < CANVASSIZE) {
						this.set('top', CANVASSIZE - (actualHeight / 2));
					}

					// Restrict movement to the right
					if (img.left - (actualWidth / 2) > 0) {
						this.set('left', actualWidth / 2);
					}

					// Restrict movement to the bottom
					if (img.top - (actualHeight / 2) > 0) {
						this.set('top', actualHeight / 2);
					}
				});
				break
			case 'img-contain':
				// No translation allowed, image can only be scaled wrt canvas center
				scaleRatio = Math.min(widthRatio, heightRatio);
				scaleRatio *= 0.8;
				img.set({
					lockMovementX: true,
					lockMovementY: true,
					centeredScaling: true,
				})
				img.setControlsVisibility({
					mb: false,
					ml: false,
					mr: false,
					mt: false,
					mtr: false,
				})
				break
		}

		img.set({
			id: "background-image",
			scaleX: scaleRatio,
			scaleY: scaleRatio,
			left: CANVASSIZE / 2,
			top: CANVASSIZE / 2,
			originX: 'middle',
			originY: 'middle',
			selectable: true,
		})

		canvas.add(img);
		canvas.renderAll();
		img.sendToBack();

		tabElems = document.querySelector(".tablist-wrapper").children
		var tabNames = []
		for (let i = 0; i < tabElems.length; i++) {
			tabNames.push(tabElems[i].id)
		}
		console.log(tabNames)
	}

	function resizeCanvasToWindow() {
		let canvasContainer = document.querySelector(".canvas-container");
		canvasContainer.style.width = "100%";
		canvasContainer.style.height = "100%";
		displaySize = canvasContainer.clientWidth
		scaleFactor = displaySize / CANVASSIZE;
		canvas.setZoom(scaleFactor);
		canvas.setWidth(displaySize);
		canvas.setHeight(displaySize);
	};

	// Extend fabric.Textbox to change how background lines are rendered
	fabric.TextboxWithCustomBackgroundFill = fabric.util.createClass(fabric.Textbox, {
		type: 'textboxwithcustombackgroundfill',

		toObject: function() {
			return fabric.util.object.extend(this.callSuper('toObject'), {
				textBackgroundColor: this.get('textBackgroundColor'),
			});
		},

		_renderTextLinesBackground: function(ctx) {
			var heightOfLine, heightScale = 0.75,
				lineLeftOffset,
				line,
				leftOffset = this._getLeftOffset(),
				lineTopOffset = this._getTopOffset(),
				boxStart = 0, boxWidth = 0, charBox, currentColor,
				drawStart;
			for (var i = 0, len = this._textLines.length; i < len; i++) {
				heightOfLine = this.getHeightOfLine(i);
				line = this._textLines[i];
				lineLeftOffset = this._getLineLeftOffset(i);
				boxWidth = 0;
				boxStart = 0;
				for (var j = 0, jlen = line.length; j < jlen; j++) {
					charBox = this.__charBounds[i][j];
					currentColor = this.getValueOfPropertyAt(i, j, 'textBackgroundColor');
					boxWidth += charBox.kernedWidth;
				}
				drawStart = leftOffset + lineLeftOffset + boxStart;
				ctx.fillStyle = currentColor;
				ctx.fillRect(
					drawStart,
					lineTopOffset + ((1 - heightScale) * heightOfLine) / 2,
					boxWidth,
					(heightOfLine / this.lineHeight) * heightScale
				);

				lineTopOffset += heightOfLine;
			}
		},
	});

	// Initalise Fabric objects
	let showNameText = new fabric.TextboxWithCustomBackgroundFill(showName, {
		fontSize: 68,
		fontFamily: "GT Maru",
		fontWeight: "bold",
		lineHeight: LINEHEIGHT,
		fill: accentColour,
		textBackgroundColor: textBackgroundColour,
		visible: textBool,
		charSpacing: CHARSPACING,
		width: TEXTWIDTH,
		left: MARGIN,
		top: YBASE,
		originY: "top",
		evented: false,
		selectable: false,
	});

	let showHostText = new fabric.TextboxWithCustomBackgroundFill("w/ " + showHost, {
		fontSize: 68,
		fontFamily: "GT Maru",
		lineHeight: LINEHEIGHT,
		fill: accentColour,
		textBackgroundColor: textBackgroundColour,
		visible: textBool,
		charSpacing: CHARSPACING,
		width: TEXTWIDTH,
		left: MARGIN,
		top: YBASE + showNameText.height + showNameText.lineHeight,
		originY: "top",
		evented: false,
		selectable: false,
	});

	let logo = new fabric.loadSVGFromURL('./assets/logo.svg', function(objects, options) {
		var svgData = fabric.util.groupSVGElements(objects, options);
		svgData.id = "logo";
		svgData.top = CANVASSIZE - MARGIN;
		svgData.left = MARGIN;
		svgData.originY = "bottom";
		svgData.scaleToWidth(67);
		svgData.scaleToHeight(53);
		svgData.fill = accentColour;
		svgData.stroke = 0;
		svgData.evented = false;
		svgData.selectable = false;
		svgData.visible = logoBool;
		canvas.add(svgData);
	});

	let overlay = new fabric.Rect({
		// Ensure canvas is filled by background colour 
		// This goes over the background image (if present)
		width: CANVASSIZE * 2,
		height: CANVASSIZE * 2,
		top: -100,
		left: -100,
		fill: overlayColour,
		evented: false,
		selectable: false,
	});
	canvas.add(overlay);

	let link = new fabric.loadSVGFromURL('./assets/link.svg', function(objects, options) {
		var svgData = fabric.util.groupSVGElements(objects, options);
		svgData.id = "link";
		svgData.top = CANVASSIZE - MARGIN - 2;
		svgData.left = CANVASSIZE - MARGIN;
		svgData.originX = "right";
		svgData.originY = "bottom";
		svgData.stroke = 0;
		svgData.evented = false;
		svgData.selectable = false;
		svgData.visible = linkBool;
		for (let i = 0; i < objects.length; i++) {
			objects[i].fill = accentColour
		}
		svgData.fill = accentColour;
		canvas.add(svgData);
	});

	let counterDays = new fabric.IText(chuntDays.toString(), {
		fontSize: 45,
		fontFamily: "GT Maru",
		fontWeight: "bold",
		fill: accentColour,
		visible: counterBool,
		left: CANVASSIZE - (2 * MARGIN) - LINKWIDTH,
		top: CANVASSIZE - MARGIN,
		originX: "right",
		originY: "bottom",
		evented: false,
		selectable: false,
	})
	canvas.add(counterDays)

	let counterStart = new fabric.loadSVGFromURL('./assets/counter-start.svg', function(objects, options) {
		var svgData = fabric.util.groupSVGElements(objects, options);
		svgData.id = "counterStart";
		svgData.top = CANVASSIZE - MARGIN - 4.5;
		svgData.left = CANVASSIZE - (2 * MARGIN) - LINKWIDTH - counterDays.width;
		svgData.originX = "right";
		svgData.originY = "bottom";
		svgData.scaleToHeight(47);
		svgData.stroke = 0;
		svgData.evented = false;
		svgData.selectable = false;
		svgData.visible = counterBool;
		for (let i = 0; i < objects.length; i++) {
			objects[i].fill = accentColour
		}
		svgData.fill = accentColour;
		canvas.add(svgData);
	});

	// Adding event listeners
	canvas.add(showNameText);
	document.getElementById("show-name").addEventListener('input', function(e) {
		showName = e.target.value
		showNameText.set({ text: showName })
		positionText()
		canvas.renderAll()
	});

	canvas.add(showHostText);
	document.getElementById("show-host").addEventListener('input', function(e) {
		showHost = e.target.value
		showHostText.set({
			text: "w/ " + showHost,
		})
		positionText()
		canvas.renderAll()
	});

	document.getElementById("show-date").addEventListener('input', function(e) {
		showDate = new Date(e.target.value)
		chuntDays = Math.ceil((showDate - CHUNT0DATE) / (1000 * 3600 * 24)) || Math.floor((new Date(Date()) - CHUNT0DATE) / (1000 * 3600 * 24));
		counterDays.set({ text: chuntDays.toString() })
		getObjectById("counterStart").set({ left: CANVASSIZE - (2 * MARGIN) - LINKWIDTH - counterDays.width })
		canvas.renderAll()
	});

	document.getElementById("text-position").addEventListener('input', function(e) {
		textPosition = e.target.value
		positionText()
		canvas.renderAll()
	});

	document.getElementById("show-img").addEventListener('input', function(e) {
		showImg.src = URL.createObjectURL(e.target.files[0]);
		imgSizing = document.querySelector("[name='img-sizing']:checked").id
		showImg.onload = () => {
			fabric.Image.fromURL(showImg.src, function(oImg) {
				setImageToBackground(oImg, imgSizing)
			})
			overlayColourPicker.set("transparent")
			overlay.set({ fill: "transparent" })
			canvas.renderAll()
		}
	});

	document.addEventListener('click', function(e) {
		if (!e.target.matches(`[type="radio"]`)) return; // Do nothing
		imgSizing = e.target.id

		if (!showImg) return;

		fabric.Image.fromURL(showImg.src, function(oImg) {
			setImageToBackground(oImg, imgSizing)
		})
	});

	backgroundColourPicker.on('move', function(e) {
		backgroundColour = e.detail.color.toRgbString()
		canvas.setBackgroundColor(backgroundColour)
		canvas.renderAll()
	});

	accentColourPicker.on('move', function(e) {
		accentColour = e.detail.color.toRgbString()
		showNameText.set({ fill: accentColour })
		showHostText.set({ fill: accentColour })
		counterDays.set({ fill: accentColour })
		setSVGColour("logo", accentColour)
		setSVGColour("link", accentColour)
		setSVGColour("counterStart", accentColour)
		canvas.renderAll()
	})

	textBackgroundColourPicker.on('show', function() {
		if (textBackgroundColour === "rgba(0, 0, 0, 0)") {
			textBackgroundColour = "white"
			textBackgroundColourPicker.set(textBackgroundColour)
			showNameText.set({ textBackgroundColor: textBackgroundColour })
			showHostText.set({ textBackgroundColor: textBackgroundColour })
			canvas.renderAll()
		}
	})

	textBackgroundColourPicker.on('move', function(e) {
		try {
			textBackgroundColour = e.detail.color.toRgbString()
		} catch (err) {
			textBackgroundColour = "transparent"
		}
		showNameText.set({ textBackgroundColor: textBackgroundColour })
		showHostText.set({ textBackgroundColor: textBackgroundColour })
		canvas.renderAll()
	})

	overlayColourPicker.on('show', function() {
		if (overlayColour === "rgba(0, 0, 0, 0)") {
			overlayColour = "rgba(0, 0, 0, 0.5)"
			overlayColourPicker.set(overlayColour)
			overlay.set({ fill: overlayColour })
			canvas.renderAll()
		}
	})

	overlayColourPicker.on('move', function(e) {
		try {
			overlayColour = e.detail.color.toRgbString()
		} catch (err) {
			overlayColour = "transparent"
		}
		overlay.set({ fill: overlayColour })
		canvas.renderAll()
	})

	document.getElementById("ge1").addEventListener('click', function(e) {
		textBool = e.target["checked"]
		showNameText.set({ visible: textBool })
		showHostText.set({ visible: textBool })
		canvas.renderAll()
	})

	document.getElementById("ge2").addEventListener('click', function(e) {
		logoBool = e.target["checked"]
		setSVGVisibility("logo", logoBool)
		canvas.renderAll()
	})

	document.getElementById("ge3").addEventListener('click', function(e) {
		counterBool = e.target["checked"]
		setSVGVisibility("counterStart", counterBool)
		counterDays.set({ visible: counterBool })
		canvas.renderAll()
	})

	document.getElementById("ge4").addEventListener('click', function(e) {
		linkBool = e.target["checked"]
		setSVGVisibility("link", linkBool)
		canvas.renderAll()
	})

	document.getElementById("save-artwork").addEventListener('click', function() {
		url = canvas.toDataURL({
			format: 'png',
			multiplier: CANVASSIZE / displaySize,
		})
		const a = document.createElement('a')
		a.href = url
		let timestamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
		a.download = timestamp + '.png'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	})

	window.addEventListener('resize', function() {
		resizeCanvasToWindow();
	});

	// Resizing canvas to fit screen
	canvas.setZoom(scaleFactor);
	canvas.setWidth(displaySize);
	canvas.setHeight(displaySize);


	resizeCanvasToWindow();
}

// Helper functions for non-Canvas elements (tablist)
function changeTab(tabname) {
	let tabs = document.querySelector(".tablist-wrapper").children
	for (let i = 0; i < tabs.length; i++) {
		tabs[i].classList.remove("active")
	}
	document.querySelector('#' + tabname).classList.add("active")
}

function openMixcloudTab() {
	changeTab("mixcloud")
	const controlElemChildren = document.querySelector(".controls-wrapper").querySelectorAll("*")
	for (let i = 0; i < controlElemChildren.length; i++) {
		let controlElemChild = controlElemChildren[i]
		if (
			(controlElemChild.classList.contains('story') || controlElemChild.classList.contains('tracklist'))
			& !controlElemChild.classList.contains('mixcloud')) {
			controlElemChild.classList.add('hidden')
		}
		if (controlElemChild.classList.contains('mixcloud')) {
			controlElemChild.classList.remove('hidden')
		}
	}
}

function openStoryTab() {
	changeTab("story")
	const controlElemChildren = document.querySelector(".controls-wrapper").querySelectorAll("*")
	for (let i = 0; i < controlElemChildren.length; i++) {
		let controlElemChild = controlElemChildren[i]
		if (
			(controlElemChild.classList.contains('mixcloud') || controlElemChild.classList.contains('tracklist'))
			& !controlElemChild.classList.contains('story')) {
			controlElemChild.classList.add('hidden')
		}
		if (controlElemChild.classList.contains('story')) {
			controlElemChild.classList.remove('hidden')
		}
	}
}

function openTracklistTab() {
	changeTab("tracklist")
	const controlElemChildren = document.querySelector(".controls-wrapper").querySelectorAll("*")
	for (let i = 0; i < controlElemChildren.length; i++) {
		let controlElemChild = controlElemChildren[i]
		if (
			(controlElemChild.classList.contains('mixcloud') || controlElemChild.classList.contains('story'))
			& !controlElemChild.classList.contains('tracklist')) {
			controlElemChild.classList.add('hidden')
		}
		if (controlElemChild.classList.contains('tracklist')) {
			controlElemChild.classList.remove('hidden')
		}
	}
}

// Handle user navigating to URL fragment
window.addEventListener("hashchange", handleHashChange());

function handleHashChange() {
	const fragment = window.location.hash.slice(1);
	switch (fragment) {
		case "mixcloud":
			openMixcloudTab()
			break
		case "story":
			openStoryTab()
			break
		case "tracklist":
			openTracklistTab()
			break
		default:
			openMixcloudTab()
			break
	}
}

