/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sora)'],
            },
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                bgBody: 'var(--bg-body)',
                bgCard: 'var(--bg-card)',
                textDark: 'var(--text-main)',
                textGrey: 'var(--text-muted)',
                borderLight: 'var(--border-light)',
            },
        },
    },
    plugins: [],
}
