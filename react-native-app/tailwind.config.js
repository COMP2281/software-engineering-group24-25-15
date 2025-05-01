/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				righteous: ["Righteous-Regular", "serif"],
				olibrick: ["Olibrick", "serif"],
			},
			colors: {
				floor: {
					DEFAULT: "#2C2E39",
				},
				black: {
					DEFAULT: "#000000",
					50: "#00000033",
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
				danger: "#F75555",
			},
		},
	},
	plugins: [],
};
