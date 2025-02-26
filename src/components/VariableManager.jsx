import { useEffect, useState } from "react";
import { isValidHex, isValidHSL } from "../utils/colorValueChecker";

function VariableManager() {
	const [designVars, setDesignVars] = useState(() => {
		const savedVars = localStorage.getItem("design");
		return savedVars ? JSON.parse(savedVars) : { colors: {}, fonts: {} };
	});

	const hasColors = Object.keys(designVars.colors || {}).length > 0;
	const hasFonts = Object.keys(designVars.fonts || {}).length > 0;
	
	const [cssOutput, setCssOutput] = useState("");
	const [colorName, setColorName] = useState("");
	const [colorValue, setColorValue] = useState("");

	const [fontName, setFontName] = useState("");
	const [fontValue, setFontValue] = useState(0);
	const [fontUnit, setFontUnit] = useState("rem");

	const [isCopyEnabled, setCopyEnabled] = useState(false);

	useEffect(() => {
		localStorage.setItem("design", JSON.stringify(designVars));

		generateCSSOutput();

		setCopyEnabled(hasColors || hasFonts);
	}, [designVars]);

	function generateCSSOutput() {
		let cssString = ":root { \n";

		Object.entries(designVars.colors).forEach(([varName, colorValue]) => {
			cssString += `    --${varName}: ${colorValue};\n`;
		});
		Object.entries(designVars.fonts).forEach(([varName, fontValue]) => {
			cssString += `    --${varName}: ${fontValue};\n`;
		});

		cssString += "}";
		setCssOutput(cssString);
	}

	function submitColors(e) {
		e.preventDefault();

		// Ensure at least one valid entry (either a color or a font)
		if (!(colorName && colorValue) && !(fontName && fontValue)) {
			alert("Variable name and value required.");
			return;
		}

		// Validate color format only if a color is being added
		if (colorName && colorValue) {
			if (!isValidHex(colorValue) && !isValidHSL(colorValue)) {
				alert(
					"Invalid color format! Use hex (#RRGGBB) or HSL (hsl(H, S%, L%))"
				);
				return;
			}

			// Add color to state
			setDesignVars((prev) => ({
				...prev,
				colors: { ...prev.colors, [colorName]: colorValue },
			}));

			// Reset input fields for colors
			setColorName("");
			setColorValue("");
		}

		// Add font only if font values exist
		if (fontName && fontValue) {
			setDesignVars((prev) => ({
				...prev,
				fonts: { ...prev.fonts, [fontName]: `${fontValue}${fontUnit}` },
			}));

			// Reset input fields for fonts
			setFontName("");
			setFontValue("");
		}

		// Enable the copy button if any variable exists
		setCopyEnabled(true);
	}

	function resetAllVariables() {
		// remove from localstorage
		localStorage.removeItem("design");

		setDesignVars({ colors: {}, fonts: {} });

		// clear the cssOutput
		setCssOutput(":root { \n }");

		// disable copy button since no code
		setCopyEnabled(false);

		alert("All variables have been reset!");
	}
	function copyBtn() {
		navigator.clipboard
			.writeText(cssOutput)
			.then(() => {
				alert("CSS copied to clipboard!");
			})
			.catch((err) => {
				console.error("Failed to copy CSS: ", err);
			});
	}
	return (
		<>
			<form onSubmit={submitColors}>
				<section className="form-wrapper">
					<div>
						<label>Color Name (e.g., primary-color):</label>
						<input
							value={colorName}
							onChange={(e) => setColorName(e.target.value)}
							type="text"
							placeholder="primary-color"
						/>
						<br />
						<span>
							<label>Enter Hex or HSL:</label>
							<br />
							<div style={{ display: "flex", flexDirection: "column" }}>
								<input
									value={colorValue}
									onChange={(e) => setColorValue(e.target.value)}
									type="text"
									placeholder="#ff5733 or hsl(200, 50%, 60%)"
								/>
								<div
									style={{ backgroundColor: colorValue }}
									className="color-box"
								></div>
							</div>
						</span>
					</div>
					<div>
						<label>Font Name (e.g., heading-sm):</label>

						<input
							type="text"
							id="fontInput"
							placeholder="heading-sm"
							value={fontName}
							onChange={(e) => setFontName(e.target.value)}
						/>
						<br />
						<span>
							<label for="unit-select">Enter Font Size:</label>
							<div>
								<input
									type="number"
									id="fontValue"
									placeholder="e.g. 32"
									value={fontValue}
									onChange={(e) => setFontValue(e.target.value)}
								/>
								<select
									id="unit-select"
									value={fontUnit}
									onChange={(e) => setFontUnit(e.target.value)}
								>
									<option value="rem">rem</option>
									<option value="em">em</option>
									<option value="px">px</option>
								</select>
							</div>
						</span>
					</div>
				</section>
				<div className="btn-group">
					<button type="submit">Add Property</button>
					<button type="button" onClick={resetAllVariables} id="reset-btn">
						Reset All Variables
					</button>
				</div>

				<h2>Generated CSS:</h2>
				<div className="code-container">
					<pre>{cssOutput}</pre>

					<button
						type="button"
						id="copy-btn"
						onClick={copyBtn}
						disabled={!isCopyEnabled}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="currentColor"
							className="bi bi-copy"
							viewBox="0 0 16 16"
						>
							<path
								fillRule="evenodd"
								d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
							></path>
						</svg>
					</button>
				</div>
			</form>
		</>
	);
}

export default VariableManager;
