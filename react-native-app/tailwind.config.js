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
			blue: {
				50: "#F3FEFF",
				100: "#658EAC",
				500: "#111928",
				800: "#0A0E1B",
			},
			gradient: {
				primary: "linear-gradient(90deg, hsla(185, 100%, 98%, 1) 0%, hsla(205, 30%, 54%, 1) 55%, hsla(226, 46%, 7%, 1) 100%);",
			},
		},
		extend: {},
	},
	plugins: [],
};
