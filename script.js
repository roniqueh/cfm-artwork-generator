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

function switchTab(selectedTab) {
	tabElems = document.querySelector(".tablist-wrapper").children
	let otherTabs = []
	// remove active class
	for (let i = 0; i < tabElems.length; i++) {
		tabElems[i].classList.remove("active")
		if (tabElems[i].id !== selectedTab) {
			otherTabs.push(tabElems[i].id)
		} else {
			tabElems[i].classList.add("active")
		}
	}
	const controlElems = document.querySelector(".controls-wrapper").querySelectorAll("*")
	for (let i = 0; i < controlElems.length; i++) {
		const controlElem = controlElems[i]

		let controlElemClassListContainsAnyOtherTab = false
		for (let j = 0; j < otherTabs.length; j++) {
			controlElemClassListContainsAnyOtherTab ||= controlElem.classList.contains(otherTabs[j])
		}
		if (controlElemClassListContainsAnyOtherTab === true) {
			controlElem.classList.add('hidden')
		}
		if (controlElem.classList.contains(selectedTab)) {
			controlElem.classList.remove('hidden')
		}
	}
}

function initaliseVariables() {
	const data = new Object
	data.showName = document.getElementById("show-name").value;
	data.showHost = document.getElementById("show-host").value;
	data.tracklist = document.getElementById("tracklist").value;
	data.showDate = new Date(document.getElementById("show-date").value || Date());
	data.chuntDays = Math.floor((data.showDate - CHUNT0DATE) / (1000 * 3600 * 24));
	data.showStart = document.getElementById("show-start").value;
	data.showEnd = document.getElementById("show-end").value;
	data.textPosition = document.getElementById("text-position").value;
	data.backgroundColour = backgroundColourPicker.get().toRgbString();
	data.accentColour = accentColourPicker.get().toRgbString();
	data.textBackgroundColour = textBackgroundColourPicker.get().toRgbString();
	data.showImg = new Image();
	data.imgSizing = document.querySelector("[name='img-sizing']:checked").id;
	data.overlayColour = overlayColourPicker.get().toRgbString();
	data.textBool = document.getElementById("ge1")['checked'];
	data.logoBool = document.getElementById("ge2")['checked'];
	data.counterBool = document.getElementById("ge3")['checked'];
	data.linkBool = document.getElementById("ge4")['checked'];
	data.tagline = document.querySelector("[name='tagline']:checked").id;
	return data
}

function setupCanvas(data, selectedTab) {
	switch (selectedTab) {
		case "mixcloud":

			break;

		default:
			break;
	}

}

function updatePage() {
	const fragment = window.location.hash.slice(1) || "mixcloud"; // sets default tab to MixCloud tab
	switchTab(fragment)
	let data = initialiseVariables()
	setupCanvas(data, fragment)
}


updatePage()

// Handle user navigating to URL fragment
window.addEventListener("hashchange", () => { updatePage() });
window.addEventListener("input", () => { console.log("change to input made") })
window.addEventListener("move", (e) => { console.log("change to color input made", e.target.value) })

