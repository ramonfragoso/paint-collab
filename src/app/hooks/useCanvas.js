import { CANVAS_BG } from '@/utils/colors'
import { useCallback, useRef } from 'react'
import { useDrawingContext } from '../context/DrawingContext'

export const useCanvas = () => {
	const {
		canvasRef,
		mouseCanvasRef,
		contextRef,
		mouseCanvasContextRef,
		isDrawingLineRef,
		isDrawingRef,
	} = useDrawingContext()

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
