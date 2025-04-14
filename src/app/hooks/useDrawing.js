import { useCallback, useState } from 'react'
import { useDrawingContext } from '../context/DrawingContext'
import { useSocket } from './useSocket'
import { CANVAS_BG } from '@/utils/colors'
import { useSocketDrawing } from './useSocketDrawing'

export function useDrawing() {
	const {
		canvasRef,
		mouseCanvasRef,
		mouseCanvasContextRef,
		contextRef,
		isDrawingRef,
		isDrawingLineRef,
		localColor,
		mode,
		setMode,
		viewportOffset,
		setViewportOffset,
		drawingHistory,
		setDrawingHistory,
	} = useDrawingContext()

	const { applyDrawing, drawHistory } = useSocketDrawing()

	const { emit, socketId } = useSocket()

	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
	const [currentUserPath, setCurrentUserPath] = useState({
		points: [],
	})

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

			if(mode === "line") {
				isDrawingLineRef.current = true
			}

			const drawingObject = {
				x,
				y,
				isNewLine: true,
				userId: socketId,
				color: localColor,
				mode,
			}
			setCurrentUserPath({
				points: [{ x, y }],
				isNewLine: true,
				userId: socketId,
				color: localColor,
				mode,
			})
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
			setCurrentUserPath,
			mode,
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

			if (mode !== 'line') {
				context.lineTo(x, y)
				context.stroke()
				setCurrentUserPath(prev => ({
					...prev,
					isNewLine: false,
					points: [...prev.points, { x, y }],
				}))
			}
			if (mode === 'line' && isDrawingLineRef.current) {
				drawHistory()
				applyDrawing({
					points: [...currentUserPath.points, { x, y }],
					socketId,
					isNewLine: false,
					color: localColor,
				})
			}

			const drawingObject = {
				x,
				y,
				isNewLine: false,
				userId: socketId,
				color: localColor,
			}
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
			setCurrentUserPath,
			currentUserPath,
			mode,
		]
	)

	const stopDrawing = useCallback(
		e => {
			e.preventDefault()
			const { clientX, clientY } = getClientCoordinates(e)
			const { x, y } = getCanvasCoordinates(clientX, clientY)
			setDrawingHistory(prev => [
				...prev,
				{ ...currentUserPath, points: [...currentUserPath.points, { x, y }] },
			])
			const drawingObject = {
				x,
				y,
				isNewLine: false,
				userId: socketId,
				color: localColor,
			}
			emit('draw', {
				isLastPoint: true,
				...drawingObject,
			})
			setCurrentUserPath({
				points: [],
			})
			if (mode === 'line' && !isDragging) {
				if (!isDrawingLineRef.current) return
				const context = contextRef.current
				context.lineTo(x, y)
				context.stroke()
				isDrawingLineRef.current = false
				return
			}

			setIsDragging(false)
			isDrawingRef.current = false
		},
		[
			contextRef,
			mode,
			isDragging,
			isDrawingLineRef,
			isDrawingRef,
			currentUserPath,
			setCurrentUserPath,
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

	const releaseMouse = useCallback(
		e => {
			e.preventDefault()
			if (mode === 'line' && !isDragging) {
				if (!isDrawingLineRef.current) return

				const context = contextRef.current
				context.lineTo(x, y)
				context.stroke()
				isDrawingLineRef.current = false
				return
			}

			setIsDragging(false)
			isDrawingRef.current = false
		},
		[
			contextRef,
			mode,
			isDragging,
			isDrawingLineRef,
			isDrawingRef,
			currentUserPath,
		]
	)

	const clearCanvas = useCallback(() => {
		setDrawingHistory([])
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
		releaseMouse,
		clearCanvas,
		handleMouseLeave,
		setMode,
	}
}
