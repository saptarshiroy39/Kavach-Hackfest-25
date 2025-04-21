import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ["Montserrat", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Security-themed colors
				security: {
					primary: '#0a84ff',
					secondary: '#30d158',
					warning: '#ff9f0a',
					danger: '#ff453a',
					info: '#64d2ff',
					dark: '#1c1c1e',
					light: '#f2f2f7',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'shield-glow': {
					'0%': {
						filter: 'drop-shadow(0 0 0.5rem rgba(10, 132, 255, 0.3))'
					},
					'25%': {
						filter: 'drop-shadow(0 0 1rem rgba(10, 132, 255, 0.5))'
					},
					'50%': {
						filter: 'drop-shadow(0 0 2rem rgba(10, 132, 255, 0.9))'
					},
					'75%': {
						filter: 'drop-shadow(0 0 1rem rgba(10, 132, 255, 0.5))'
					},
					'100%': {
						filter: 'drop-shadow(0 0 0.5rem rgba(10, 132, 255, 0.3))'
					}
				},
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'bob': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        'shield-appear': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.7)'
          },
          '70%': {
            opacity: '1',
            transform: 'scale(1.1)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 3s infinite',
				'shield-glow': 'shield-glow 4s infinite',
        'shield-appear-glow': 'shield-appear 1s ease-out forwards, shield-glow 4s 1s infinite',
        'bounce': 'bounce 2s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'bob': 'bob 2s infinite ease-in-out'
			},
			backgroundImage: {
				'security-gradient': 'linear-gradient(to right, #0a84ff, #30d158)',
				'dark-gradient': 'linear-gradient(to right, #1c1c1e, #2c2c2e)',
        'glass-gradient': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))',
        'dark-glass-gradient': 'linear-gradient(to right bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2))',
        'cool-blue': 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
        'cool-green': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'cool-purple': 'linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
