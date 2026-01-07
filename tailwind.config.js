/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sora)'],
            },
            colors: {
                primary: '#2563EB',
                secondary: '#10B981',
                bgBody: '#F3F4F6',
                bgCard: '#FFFFFF',
                textDark: '#1F2937',
                textGrey: '#6B7280',
            },
        },
    },
    plugins: [],
}
