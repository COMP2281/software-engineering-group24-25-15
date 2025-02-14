/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				righteous: ["Righteous-Regular", "serif"],
			},
			colors: {
				black: {
					DEFAULT: "#000000",
					100: "#00000091",
				},
				grey: {
					DEFAULT: "#27272790",
					100: "#F7F7F7",
					200: "#E5E5E5",
				},
				blue: {
					100: "#83B0D0",
				},
			},
		},
	},
	plugins: [],
};
