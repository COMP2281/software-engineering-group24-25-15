/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		colors: {
			white: "#fff",
			black: "#000",

			grey: {
				primary: "#353535",
			},
		},
		extend: {},
	},
	plugins: [],
};
