/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Define where Tailwind should look for classes in your project
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here
      colors: {
        // Define custom colors here
        'custom-yellow': '#FFB81D', // Example of a custom color
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        bounce: 'bounce 3s infinite',
        fadeIn: 'fadeIn 0.5s ease-in',
      },
      // Add more theme customizations as needed
    },
  },
  plugins: [
    // You can add Tailwind plugins here if needed
  ],
};
