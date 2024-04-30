let html5Canvas = document.getElementById("canvas");
const CANVASSIZE = html5Canvas.width;
const MARGIN = 40;
const YBASE = MARGIN;
const TEXTWIDTH = CANVASSIZE - (2 * MARGIN);
const LINEHEIGHT = 0.915;
const CHARSPACING = -50;
const LINKWIDTH = 195;
const CHUNT0DATE = new Date("2022-03-14");

// Resize HTML5 Canvas to fit parent wrapper (size controlled by CSS)
html5Canvas.style.width = "100%";
html5Canvas.style.height = "100%";

// Square aspect ratio, so just use clientWidth for size
let displaySize = html5Canvas.clientWidth;
let scaleFactor = displaySize / CANVASSIZE;

const canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
canvas.hoverCursor = 'pointer';

// Initialise variables
let showName = document.getElementById("show-name").value;
let showHost = document.getElementById("show-host").value;
let showDate = new Date(document.getElementById("show-date").value || Date());
let textPosition = document.getElementById("text-position").value = 0;
// Following two require the fabric.Textbox of showName and showHost to be created first => set textPosition to 0 above
let maxYOffset;
let yOffset;
let chuntDays = Math.floor((showDate - CHUNT0DATE) / (1000 * 3600 * 24));
let showImg = new Image();
let imgSizing = document.querySelector("[name='img-sizing']:checked").id;
let accentColour = document.getElementById("accent-colour").value;
let accentOpacity = document.getElementById("accent-opacity").value;
let backgroundColour = document.getElementById("background-colour").value;
let backgroundOpacity = document.getElementById("background-opacity").value;
let textBool = document.getElementById("ge1")['checked'];
let logoBool = document.getElementById("ge2")['checked'];
let counterBool = document.getElementById("ge3")['checked'];
let linkBool = document.getElementById("ge4")['checked'];

// Helper functions
function getObjectById(id) {
	for (let i = 0; i < canvas.getObjects().length; i++) {
		let object = canvas.getObjects()[i]
		if (object.id === id) {
			return object
		}
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

function setSVGOpacity(id, opacity) {
	let SVGObject = getObjectById(id);
	SVGObject.set({ opacity: opacity })
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
	switch (imgSizing) {
		case 'img-cover':
			scaleRatio = Math.max(CANVASSIZE / img.width, CANVASSIZE / img.height);
			break
		case 'img-contain':
			scaleRatio = Math.min(CANVASSIZE / img.width, CANVASSIZE / img.height);
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

// Defining fabric objects
let showNameText = new fabric.Textbox(showName, {
	fontSize: 68,
	fontFamily: "GT Maru",
	fontWeight: "bold",
	lineHeight: LINEHEIGHT,
	fill: accentColour,
	opacity: +accentOpacity / 100,
	visible: textBool,
	charSpacing: CHARSPACING,
	width: TEXTWIDTH,
	left: MARGIN,
	top: YBASE,
	originY: "top",
	evented: false,
});

let showHostText = new fabric.Textbox("w/ " + showHost, {
	fontSize: 68,
	fontFamily: "GT Maru",
	lineHeight: LINEHEIGHT,
	fill: accentColour,
	opacity: +accentOpacity / 100,
	visible: textBool,
	charSpacing: CHARSPACING,
	width: TEXTWIDTH,
	left: MARGIN,
	top: YBASE + showNameText.height + showNameText.lineHeight,
	originY: "top",
	evented: false,
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
	svgData.opacity = +accentOpacity / 100;
	svgData.visible = logoBool;
	canvas.add(svgData);
});

let background = new fabric.Rect({
	// Ensure canvas is filled by background colour 
	// This goes over the background image (if present)
	width: CANVASSIZE * 2,
	height: CANVASSIZE * 2,
	top: -100,
	left: -100,
	fill: backgroundColour,
	opacity: +backgroundOpacity / 100,
	evented: false,
});
canvas.add(background);

let link = new fabric.loadSVGFromURL('./assets/link.svg', function(objects, options) {
	var svgData = fabric.util.groupSVGElements(objects, options);
	svgData.id = "link";
	svgData.top = CANVASSIZE - MARGIN - 2;
	svgData.left = CANVASSIZE - MARGIN;
	svgData.originX = "right";
	svgData.originY = "bottom";
	svgData.stroke = 0;
	svgData.evented = false;
	svgData.opacity = +accentOpacity / 100;
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
	opacity: +accentOpacity / 100,
	visible: counterBool,
	left: CANVASSIZE - (2 * MARGIN) - LINKWIDTH,
	top: CANVASSIZE - MARGIN,
	originX: "right",
	originY: "bottom",
	evented: false,
})
canvas.add(counterDays)

let counterStart = new fabric.loadSVGFromURL('./assets/counter-start.svg', function(objects, options) {
	var svgData = fabric.util.groupSVGElements(objects, options);
	svgData.id = "counterStart";
	svgData.top = CANVASSIZE - MARGIN - 4.5;
	svgData.left = CANVASSIZE - (2 * MARGIN) - LINKWIDTH - counterDays.width - 4;
	svgData.originX = "right";
	svgData.originY = "bottom";
	svgData.scaleToHeight(47);
	svgData.stroke = 0;
	svgData.evented = false;
	svgData.opacity = +accentOpacity / 100;
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
		document.getElementById("background-opacity").value = 0
		background.set({ "opacity": 0 })
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

document.getElementById("accent-colour").addEventListener('input', function(e) {
	accentColour = e.target.value
	showNameText.set({ fill: accentColour })
	showHostText.set({ fill: accentColour })
	counterDays.set({ fill: accentColour })
	setSVGColour("logo", accentColour)
	setSVGColour("link", accentColour)
	setSVGColour("counterStart", accentColour)
	console.log(canvas.getObjects())
	canvas.renderAll()
})

document.getElementById("accent-opacity").addEventListener('input', function(e) {
	accentOpacity = e.target.value
	showNameText.set({ opacity: +accentOpacity / 100 })
	showHostText.set({ opacity: +accentOpacity / 100 })
	counterDays.set({ opacity: +accentOpacity / 100 })
	setSVGOpacity("link", +accentOpacity / 100)
	setSVGOpacity("logo", +accentOpacity / 100)
	setSVGOpacity("counterStart", +accentOpacity / 100)
	canvas.renderAll()
})

document.getElementById("background-colour").addEventListener('input', function(e) {
	backgroundColour = e.target.value
	background.set({ fill: backgroundColour })
	canvas.renderAll()
})

document.getElementById("background-opacity").addEventListener('input', function(e) {
	backgroundOpacity = e.target.value
	background.set({ opacity: +backgroundOpacity / 100 })
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


