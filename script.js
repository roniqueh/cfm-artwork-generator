let html5Canvas = document.getElementById("canvas");
const CANVASSIZE = html5Canvas.width;
const MARGIN = 40;
const YBASE = MARGIN;
const TEXTWIDTH = CANVASSIZE - (2 * MARGIN);
const LINEHEIGHT = 0.915;
const CHARSPACING = -50;
const CHUNT0DATE = new Date("2022-03-14");

// Resize HTML5 Canvas to fit parent wrapper
html5Canvas.style.width = "100%";
html5Canvas.style.height = "100%";

// Square aspect ratio, so just use clientWidth for size
let displaySize = html5Canvas.clientWidth;
let scaleFactor = displaySize / CANVASSIZE;

const canvas = new fabric.Canvas('canvas');
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
	selectable: false,
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
	selectable: false,
});

logo = new fabric.loadSVGFromURL('./assets/logo.svg', function(objects, options) {
	var svgData = fabric.util.groupSVGElements(objects, options);
	svgData.top = CANVASSIZE - MARGIN;
	svgData.left = MARGIN;
	svgData.originY = "bottom";
	svgData.scaleToWidth(67);
	svgData.scaleToHeight(53);
	svgData.fill = accentColour;
	svgData.stroke = 0;
	svgData.selectable = false;
	svgData.opacity = +accentOpacity / 100;
	svgData.visible = logoBool;
	canvas.add(svgData);
});

let background = new fabric.Rect({
	width: CANVASSIZE * 2,
	height: CANVASSIZE * 2,
	top: -100,
	left: -100,
	fill: backgroundColour,
	opacity: +backgroundOpacity / 100,
	selectable: false,
});
canvas.add(background);


function setImageToBackground(img, imgSizing) {
	let scaleRatio;
	switch (imgSizing) {
		case 'img-cover':
			scaleRatio = Math.max(CANVASSIZE / img.width, CANVASSIZE / img.height);
			break
		case 'img-contain':
			scaleRatio = Math.min(CANVASSIZE / img.width, CANVASSIZE / img.height);
			break
	}

	canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
		scaleX: scaleRatio,
		scaleY: scaleRatio,
		left: CANVASSIZE / 2,
		top: CANVASSIZE / 2,
		originX: 'middle',
		originY: 'middle',
		selectable: true,
	});
}

let link = new fabric.Textbox("chunt.org", {
	fontSize: 45,
	fontFamily: "GT Maru",
	fill: accentColour,
	opacity: +accentOpacity / 100,
	visible: linkBool,
	charSpacing: -110,
	left: CANVASSIZE - MARGIN,
	top: CANVASSIZE - MARGIN,
	originX: "right",
	originY: "bottom",
	selectable: false,
});
canvas.add(link);

let counterDays = new fabric.IText(chuntDays.toString(), {
	fontSize: 45,
	fontFamily: "GT Maru",
	fontWeight: "bold",
	fill: accentColour,
	opacity: +accentOpacity / 100,
	visible: counterBool,
	charSpacing: -50,
	left: CANVASSIZE - (2 * MARGIN) - link.width,
	top: CANVASSIZE - MARGIN,
	originX: "right",
	originY: "bottom",
	selectable: false,
})
canvas.add(counterDays)

let counterStart = new fabric.IText("CHUNT ", {
	fontSize: 45,
	fontFamily: "GT Maru",
	fontWeight: "bold",
	fill: accentColour,
	opacity: +accentOpacity / 100,
	visible: counterBool,
	charSpacing: -90,
	left: CANVASSIZE - (2 * MARGIN) - link.width - counterDays.width,
	top: CANVASSIZE - MARGIN,
	originX: "right",
	originY: "bottom",
	selectable: false,
})
canvas.add(counterStart)


canvas.add(showNameText);
document.getElementById("show-name").addEventListener('input', function(e) {
	showName = e.target.value
	showNameText.set({ text: showName })
	maxYOffset = CANVASSIZE - (4 * MARGIN) - showNameText.height - showHostText.height
	yOffset = (+textPosition / 100) * maxYOffset
	showNameText.set({
		top: YBASE + yOffset
	})
	showHostText.set({
		top: YBASE + yOffset + showNameText.height - 6
	})
	canvas.renderAll()
});

canvas.add(showHostText);
document.getElementById("show-host").addEventListener('input', function(e) {
	showHost = e.target.value
	showHostText.set({
		text: "w/ " + showHost,
	})
	canvas.renderAll()
});

document.getElementById("show-date").addEventListener('input', function(e) {
	showDate = new Date(e.target.value)
	chuntDays = Math.ceil((showDate - CHUNT0DATE) / (1000 * 3600 * 24)) || Math.floor((new Date(Date()) - CHUNT0DATE) / (1000 * 3600 * 24));
	counterDays.set({ text: chuntDays.toString() })
	counterStart.set({ left: CANVASSIZE - (2 * MARGIN) - link.width - counterDays.width })
	canvas.renderAll()
});

document.getElementById("text-position").addEventListener('input', function(e) {
	textPosition = e.target.value
	maxYOffset = CANVASSIZE - (4 * MARGIN) - showNameText.height - showHostText.height
	yOffset = (+textPosition / 100) * maxYOffset
	showNameText.set({
		top: YBASE + yOffset
	})
	showHostText.set({
		top: YBASE + showNameText.height + showNameText.lineHeight + yOffset
	})
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
	counterStart.set({ fill: accentColour })
	counterDays.set({ fill: accentColour })
	link.set({ fill: accentColour })
	var _logo = canvas.getObjects("path")[0]
	_logo.set({ fill: accentColour })
	canvas.renderAll()
})

document.getElementById("accent-opacity").addEventListener('input', function(e) {
	accentOpacity = e.target.value
	showNameText.set({ opacity: +accentOpacity / 100 })
	showHostText.set({ opacity: +accentOpacity / 100 })
	counterStart.set({ opacity: +accentOpacity / 100 })
	counterDays.set({ opacity: +accentOpacity / 100 })
	link.set({ opacity: +accentOpacity / 100 })
	var _logo = canvas.getObjects("path")[0]
	_logo.set({ opacity: +accentOpacity / 100 })
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
	var _logo = canvas.getObjects("path")[0]
	_logo.set({ visible: logoBool })
	canvas.renderAll()
})

document.getElementById("ge3").addEventListener('click', function(e) {
	counterBool = e.target["checked"]
	counterStart.set({ visible: counterBool })
	counterDays.set({ visible: counterBool })
	canvas.renderAll()
})

document.getElementById("ge4").addEventListener('click', function(e) {
	linkBool = e.target["checked"]
	link.set({ visible: linkBool })
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

// Resizing canvas to fit screen
canvas.setZoom(scaleFactor);
canvas.setWidth(displaySize);
canvas.setHeight(displaySize);

window.addEventListener('resize', function() {
	let canvasContainer = document.querySelector(".canvas-container");
	canvasContainer.style.width = "100%";
	canvasContainer.style.height = "100%";
	displaySize = canvasContainer.clientWidth
	scaleFactor = displaySize / CANVASSIZE;
	canvas.setZoom(scaleFactor);
	canvas.setWidth(displaySize);
	canvas.setHeight(displaySize);
});

