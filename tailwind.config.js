/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",        /* 루트에 있는 App.tsx, index.tsx 등을 읽음 */
    "./pages/**/*.{js,ts,jsx,tsx}", /* pages 폴더 안의 파일들을 읽음 */
    "./components/**/*.{js,ts,jsx,tsx}" /* components 폴더 안의 파일들을 읽음 */
  ],
  theme: {
    extend: {
      colors: {
        'doldam-accent': '#E85C41',
        'doldam-dark': '#1a1a1a',
      },
    },
  },
  plugins: [],
}