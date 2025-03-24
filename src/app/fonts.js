import { Inter, Indie_Flower, Geist, Geist_Mono } from 'next/font/google'

export const handDrawn = Indie_Flower({
	subsets: ['latin'],
	weight: '400',
	display: 'swap',
})

export const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

export const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})
// You can keep a fallback font if needed
export const inter = Inter({ subsets: ['latin'] })
