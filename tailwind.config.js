export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: { // 流光線條下滑
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseScale: { // 光環脈動
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
      animation: {
        slide: 'slide linear infinite',
        pulseScale: 'pulseScale 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
