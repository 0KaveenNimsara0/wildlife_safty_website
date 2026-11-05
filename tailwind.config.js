/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['"Segoe UI"', 'Arial', 'sans-serif'] },
      colors: {
        emerald: {50:'#eff6f1',100:'#dcece0',200:'#bcd8c5',300:'#8dbb9e',400:'#5c9774',500:'#397b58',600:'#286345',700:'#205139',800:'#1c412f',900:'#173628',950:'#0c2018'},
        slate: {50:'#f6f7f3',100:'#edefe8',200:'#dfe4da',300:'#c3ccbf',400:'#8d9b8b',500:'#627260',600:'#4c5c4c',700:'#394a3b',800:'#293a2e',900:'#192b21',950:'#101c16'},
      },
    },
  },
  plugins: [],
}
