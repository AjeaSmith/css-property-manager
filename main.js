// Initialize an empty object for colors
if (!window.colors) {
	window.colors = {};
}

// load colors from localstorage
window.colors = JSON.parse(localStorage.getItem(colors)) || {};

document.addEventListener("DOMContentLoaded", () => {
	loadSavedColors();
	updateCSSOutput();
});

const colorInput = document.getElementById("colorInput");
const colorBox = document.querySelector(".color-box");

// Live preview of color change
colorInput.addEventListener("input", function () {
	const colorValue = colorInput.value.trim();
	if (isValidHex(colorValue) || isValidHSL(colorValue)) {
		colorBox.style.backgroundColor = colorValue;
	}
});

function addColor() {
	const varNameInput = document.getElementById("varNameInput");
	const colorInput = document.getElementById("colorInput");

	const varName = varNameInput.value.trim();
	const colorValue = colorInput.value.trim();

	if (!isValidHex(colorValue) && !isValidHSL(colorValue)) {
		alert("Invalid color format! Use hex (#RRGGBB) or HSL (hsl(H, S%, L%))");
		return;
	}
	if (!varName) {
		alert("Variable name required!");
		return;
	}

	// Load existing colors from localStorage (if any) before updating
	let savedColors = JSON.parse(localStorage.getItem("colors")) || {};
	savedColors[varName] = colorValue;

	// Update colors object dynamically
	window.colors = savedColors;

	// save color to localstorage
	localStorage.setItem("colors", JSON.stringify(window.colors));

	// Apply new CSS variable to :root
	document.documentElement.style.setProperty(varName, colorValue);

	// Reset preview box to default color
	colorBox.style.backgroundColor = "";

	// Update the displayed CSS
	updateCSSOutput();

	// ✅ Clear input fields after adding color
	varNameInput.value = "";
	colorInput.value = "";
}

function loadSavedColors() {
	let savedColors = JSON.parse(localStorage.getItem("colors")) || {};

	// ✅ Update global colors object
	window.colors = savedColors;

	// Apply saved colors to :root
	for (const [varName, colorValue] of Object.entries(savedColors)) {
		document.documentElement.style.setProperty(varName, colorValue);
	}

	updateCSSOutput();
}

function resetAllColors() {
	// remove from localstorage
	localStorage.removeItem("colors");

	// clear global colors obj
	window.colors = {};

	// clear the cssOutput
	document.getElementById("cssOutput").textContent = ":root { \n \n }";

	// disable copy button since no code
	document.getElementById("copy-btn").disabled = true;

	alert("All colors have been reset!");
}

function copyCode() {
	const cssText = document.getElementById("cssOutput").textContent;

	navigator.clipboard
		.writeText(cssText)
		.then(() => {
			alert("CSS copied to clipboard!");
		})
		.catch((err) => {
			console.error("Failed to copy CSS: ", err);
		});
}

function isValidHex(hex) {
	return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

function isValidHSL(hsl) {
	return /^hsl\(\d{1,3},\s*\d{1,3}%?,\s*\d{1,3}%?\)$/.test(hsl);
}

function updateCSSOutput() {
	let cssString = ":root { \n ";
	let hasColors = false;
	for (const [varName, colorValue] of Object.entries(window.colors)) {
		cssString += `    --${varName}: ${colorValue};\n`;
		hasColors = true;
	}
	cssString += " \n}";
	document.getElementById("cssOutput").textContent = cssString;

	// Enable or disable copy button based on content
	document.getElementById("copy-btn").disabled = !hasColors;
}

// Initialize output on load (if any colors exist)
updateCSSOutput();

