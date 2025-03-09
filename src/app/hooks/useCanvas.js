import { CANVAS_BG } from '@/utils/colors'
import { useCallback, useRef } from 'react'

export const useCanvas = initialColor => {
	const canvasRef = useRef(null)
	const mouseCanvasRef = useRef(null)
	const isDrawingRef = useRef(false)
	const isDrawingLineRef = useRef(false)
	const mouseCanvasContextRef = useRef(null)
	const contextRef = useRef(null)

	const initializeCanvas = useCallback(() => {
		const canvas = canvasRef.current
		const mouseCanvas = mouseCanvasRef.current
		if (!canvas || !mouseCanvas) return

		mouseCanvas.width = mouseCanvas.offsetWidth
		canvas.width = canvas.offsetWidth
		mouseCanvas.height = mouseCanvas.offsetHeight
		canvas.height = canvas.offsetHeight

		const context = canvas.getContext('2d')
		const mouseContext = mouseCanvas.getContext('2d')

		if (!context) return
		context.fillStyle = CANVAS_BG
		context.fillRect(0, 0, canvas.width, canvas.height)
		context.lineWidth = 2
		context.lineCap = 'round'

		// context.fillStyle = 'white'
		// context.fillRect(200, 200, 100, 100)
		
		// // context.save()
		// context.translate(50,50)
		// // context.restore()
		// context.fillStyle = 'green'
		// context.fillRect(200, 200, 100, 100)

		contextRef.current = context

		if (!mouseContext) return
		mouseCanvasContextRef.current = mouseContext
	}, [])

	const changeLineWidth = useCallback(color => {
		const context = contextRef.current
		if (context) {
			context.lineWidth = color === CANVAS_BG ? 25 : 3
		}
	}, [])

	return {
		canvasRef,
		mouseCanvasRef,
		isDrawingRef,
		isDrawingLineRef,
		contextRef,
		mouseCanvasContextRef,
		initializeCanvas,
		changeLineWidth,
	}
}
