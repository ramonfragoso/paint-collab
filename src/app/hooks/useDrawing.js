import { useCallback, useState } from 'react'
import { useDrawingContext } from '../context/DrawingContext'
import { useSocket } from './useSocket'
import { CANVAS_BG } from '@/utils/colors'

export function useDrawing() {
	const {
		canvasRef,
		mouseCanvasRef,
		contextRef,
		isDrawingRef,
		isDrawingLineRef,
		localColor,
		mode,
		setMode,
		viewportOffset,
		setViewportOffset,
		setDrawingHistory,
	} = useDrawingContext()

	const { emit, socketId } = useSocket()

	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

	const getClientCoordinates = e => {
		if (e.touches) {
			return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
		}
		return { clientX: e.clientX, clientY: e.clientY }
	}

	const getCanvasCoordinates = (clientX, clientY) => {
		const canvas = canvasRef.current
		const rect = canvas.getBoundingClientRect()
		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		}
	}

	const startDrawing = useCallback(
		e => {
			const { clientX, clientY } = getClientCoordinates(e)

			if (e.button === 1 || (e.button === 0 && e.altKey) || mode === 'drag') {
				setDragStart({ x: clientX, y: clientY })
				setIsDragging(true)
				e.preventDefault()
				return
			}

			const canvas = canvasRef.current
			const context = contextRef.current

			if (!canvas || !context) return

			const { x, y } = getCanvasCoordinates(clientX, clientY)
			const relativeX = x - viewportOffset.x
			const relativeY = y - viewportOffset.y

			context.strokeStyle = localColor
			context.beginPath()
			context.moveTo(relativeX, relativeY)

			if (mode === 'line') {
				isDrawingLineRef.current = true
				return
			}

			const drawingObject = {
				x,
				y,
				isNewLine: true,
				userId: socketId,
				color: localColor,
			}
			setDrawingHistory(prev => [...prev, drawingObject])
			emit('draw', drawingObject)
			isDrawingRef.current = true
		},
		[
			canvasRef,
			contextRef,
			socketId,
			localColor,
			viewportOffset,
			mode,
			isDrawingLineRef,
			isDrawingRef,
		]
	)

	const draw = useCallback(
		e => {
			const { clientX, clientY } = getClientCoordinates(e)

			if (isDragging) {
				const dx = clientX - dragStart.x
				const dy = clientY - dragStart.y

				setViewportOffset(prev => {
					const newX = prev.x + dx
					const newY = prev.y + dy
					return { x: newX, y: newY }
				})

				setDragStart({ x: clientX, y: clientY })
				return
			}

			trackMouseMove(clientX, clientY)

			if (!isDrawingRef.current) return

			const canvas = canvasRef.current
			const context = contextRef.current
			if (!canvas || !context) return

			const { x, y } = getCanvasCoordinates(clientX, clientY)

			context.lineTo(x, y)
			context.stroke()

			const drawingObject = {
				x,
				y,
				isNewLine: false,
				userId: socketId,
				color: localColor,
			}
			setDrawingHistory(prev => [...prev, drawingObject])
			emit('draw', drawingObject)
		},
		[
			canvasRef,
			contextRef,
			isDragging,
			dragStart,
			isDrawingRef,
			emit,
			socketId,
			localColor,
			viewportOffset,
		]
	)

	const trackMouseMove = useCallback(
		(clientX, clientY) => {
			const canvas = mouseCanvasRef.current
			const rect = canvas.getBoundingClientRect()
			const x = clientX - rect.left
			const y = clientY - rect.top
			emit('mouse-move', { x, y, socketId, viewportOffset })
		},
		[mouseCanvasRef, emit, socketId, viewportOffset]
	)

	const stopDrawing = useCallback(
		e => {
			e.preventDefault()

			if (mode === 'line' && !isDragging) {
				if (!isDrawingLineRef.current) return

				const { clientX, clientY } = getClientCoordinates(e)
				const { x, y } = getCanvasCoordinates(clientX, clientY)

				const context = contextRef.current
				context.lineTo(x, y)
				context.stroke()
				isDrawingLineRef.current = false
				return
			}

			setIsDragging(false)
			isDrawingRef.current = false
		},
		[contextRef, mode, isDragging, isDrawingLineRef, isDrawingRef]
	)

	const clearCanvas = useCallback(() => {
		const canvas = canvasRef.current
		const context = contextRef.current
		if (context) {
			context.fillStyle = CANVAS_BG
			context.fillRect(0, 0, canvas.width, canvas.height)
		}
		emit('clear-canvas')
	}, [canvasRef, contextRef, emit])

	const handleMouseLeave = useCallback(() => {
		emit('mouse-leave', { socketId })
	}, [emit, socketId])

	return {
		startDrawing,
		draw,
		stopDrawing,
		clearCanvas,
		handleMouseLeave,
		setMode,
	}
}
