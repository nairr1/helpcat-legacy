/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
    colors: {
        black: '#121212',
        white: '#ffffff',
        neonBlueGreen: '#85e0d7',
        lightBlueGreen: '#f0fff9',
        darkBlue: '#546b99',
        darkPurple: '#282a36',
        bgPurple: '#191a21',
        pastelPink: '#bd8bd4',
        redError: '#ff4063',
        upvote: '#7e7ecf',
        downvote: '#ff9a9a',
        online: '#5ea05e',
        softPink: '#d4b9b9',
        lightBlue: '#82d6e9',
        bgBlue: '#2f334a',
        green: '#67cda6',
        orange: '#e5a766',
    },
    fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
        sans: ['Rubik', 'sans-serif'],
    },
  },
  plugins: [],
}
