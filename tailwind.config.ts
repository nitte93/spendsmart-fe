import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fall: {
          '0%': { transform: 'translateX(-50%) translateY(0)' },
          '100%': { transform: 'translateX(-50%) translateY(200px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },        
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
        fall: 'fall 1s ease-in-out forwards',
        flicker: 'flicker 1.5s ease-in-out infinite',
        rise: 'rise 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
  safelist: [
    'animate-[wiggle_0.3s_ease-in-out_infinite]',
    'animate-[bounce_0.5s_ease-in-out]',
    'animate-[fall_1s_ease-in-out_forwards]',
    'animate-[flicker_1.5s_ease-in-out_infinite]',
    'animate-[flicker_2s_ease-in-out_infinite]',
    'animate-[flicker_2.5s_ease-in-out_infinite]',
    'animate-[flicker_3s_ease-in-out_infinite]',
    'animate-[rise_2s_ease-in-out_infinite]',  ],
};
export default config;
