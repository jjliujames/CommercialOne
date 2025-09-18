/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'td-green': '#00A651',
                'td-dark-green': '#007A3D',
                'td-gray': '#F5F5F5',
                'td-dark-gray': '#333333'
            }
        },
    },
    plugins: [],
} 