/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./mobile/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "#27272a", // zinc-800
                input: "#27272a", // zinc-800
                ring: "#84cc16", // lime-500
                background: "#09090b", // zinc-950
                foreground: "#fafafa", // zinc-50
                primary: {
                    DEFAULT: "#84cc16", // lime-500
                    foreground: "#09090b", // zinc-950
                },
                secondary: {
                    DEFAULT: "#27272a", // zinc-800
                    foreground: "#fafafa", // zinc-50
                },
                destructive: {
                    DEFAULT: "#ef4444", // red-500
                    foreground: "#fafafa", // zinc-50
                },
                muted: {
                    DEFAULT: "#27272a", // zinc-800
                    foreground: "#a1a1aa", // zinc-400
                },
                accent: {
                    DEFAULT: "#27272a", // zinc-800
                    foreground: "#fafafa", // zinc-50
                },
                popover: {
                    DEFAULT: "#09090b", // zinc-950
                    foreground: "#fafafa", // zinc-50
                },
                card: {
                    DEFAULT: "#09090b", // zinc-950
                    foreground: "#fafafa", // zinc-50
                },
            },
            borderRadius: {
                lg: "0.5rem",
                md: "calc(0.5rem - 2px)",
                sm: "calc(0.5rem - 4px)",
            },
        },
    },
    plugins: [],
}
