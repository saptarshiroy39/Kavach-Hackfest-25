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
					primary: 'var(--security-primary)',
					secondary: 'var(--security-secondary)',
					warning: 'var(--security-warning)',
					danger: 'var(--security-danger)',
					info: 'var(--security-info)',
					dark: 'var(--security-dark)',
					light: 'var(--security-light)',
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
						filter: 'drop-shadow(0 0 0.5rem rgba(0, 112, 243, 0.3))'
					},
					'25%': {
						filter: 'drop-shadow(0 0 1rem rgba(0, 112, 243, 0.5))'
					},
					'50%': {
						filter: 'drop-shadow(0 0 2rem rgba(0, 112, 243, 0.9))'
					},
					'75%': {
						filter: 'drop-shadow(0 0 1rem rgba(0, 112, 243, 0.5))'
					},
					'100%': {
						filter: 'drop-shadow(0 0 0.5rem rgba(0, 112, 243, 0.3))'
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
        },
        'slide-up-fade': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-down-fade': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'zoom-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        'subtle-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' }
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
        'bob': 'bob 2s infinite ease-in-out',
        'slide-up-fade': 'slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down-fade': 'slide-down-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'zoom-in': 'zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'subtle-shake': 'subtle-shake 0.5s ease-in-out'
			},
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
        'height': 'height',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'opacity': 'opacity',
        'shadow': 'box-shadow, filter',
        'transform': 'transform',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'fancy': 'cubic-bezier(0.76, 0, 0.24, 1)'
      },
			backgroundImage: {
				'security-gradient': 'linear-gradient(to right, var(--security-primary), var(--security-secondary))',
				'dark-gradient': 'linear-gradient(to right, var(--security-dark), #2c2c2e)',
        'glass-gradient': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.3))',
        'dark-glass-gradient': 'linear-gradient(to right bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2))',
        'cool-blue': 'linear-gradient(135deg, #0070f3 0%, #60a5fa 100%)',
        'cool-green': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'cool-purple': 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
        'modern-card': 'linear-gradient(120deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
        'modern-card-dark': 'linear-gradient(120deg, rgba(40, 40, 50, 0.8), rgba(20, 20, 30, 0.4))',
        'subtle-pattern': 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 4px)',
        'subtle-pattern-dark': 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 4px)',
        'blur-background': 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%)',
        'blur-background-dark': 'linear-gradient(135deg, rgba(20, 20, 30, 0.5) 0%, rgba(10, 10, 15, 0.1) 100%)'
			},
      boxShadow: {
        'soft-sm': '0 2px 10px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 5px 30px 0 rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 10px 50px 0 rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 15px 60px 0 rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 0 10px 0 rgba(255, 255, 255, 0.5)',
        'inner-glow-dark': 'inset 0 0 10px 0 rgba(0, 0, 0, 0.3)',
        'button-glow': '0 0 15px 5px rgba(0, 112, 243, 0.3)',
        'button-glow-dark': '0 0 15px 5px rgba(59, 130, 246, 0.3)',
        'sidebar': '5px 0 30px 0 rgba(0, 0, 0, 0.05)',
        'sidebar-dark': '5px 0 30px 0 rgba(0, 0, 0, 0.2)'
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
