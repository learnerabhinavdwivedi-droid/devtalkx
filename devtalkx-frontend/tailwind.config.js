/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                devDark: "#020617",
                devAccent: "#3b82f6",
            }
        },
    },
    plugins: [],
}
