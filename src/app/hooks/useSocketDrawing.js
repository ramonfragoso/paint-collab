import { CANVAS_BG } from '@/utils/colors'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useSocket } from './useSocket'
import { useDrawingContext } from '../context/DrawingContext'

const CURSOR_OFFSET_X = -19
const CURSOR_OFFSET_Y = -9
const CURSOR_WIDTH = 47
const CURSOR_HEIGHT = 47

export const useSocketDrawing = () => {
	const { on, off } = useSocket()
	const {
		contextRef,
		mouseCanvasContextRef,
		userPaths,
		setUserPaths,
		userCursorsRef,
		drawingHistory,
		setDrawingHistory,
		viewportOffset,
	} = useDrawingContext()

	const [cursorImages, setCursorImages] = useState([])
	const [imagesLoaded, setImagesLoaded] = useState(false)
	const [currentUserPath, setCurrentUserPath] = useState({
		points: [],
	})

	const cursors = ['red', 'blue', 'yellow', 'green', 'orange']

	const applyDrawing = drawData => {
		const context = contextRef.current
		const { points, socketId, isNewLine, color } = drawData
		points?.forEach((point, index) => {
			const absX = point.x
			const absY = point.y
			context.strokeStyle = color
			if (index === 0) {
				context.beginPath()
				context.moveTo(absX, absY)
				userPaths.set(socketId, { x: absX, y: absY })
			} else {
				const lastPos = userPaths.get(socketId)
				if (lastPos) {
					context.beginPath()
					context.moveTo(lastPos.x, lastPos.y)
					context.lineTo(absX, absY)
					context.stroke()
					userPaths.set(socketId, { x: absX, y: absY })
				}
			}
		})
	}

	const drawHistory = useCallback(() => {
		const context = contextRef.current
		if (context) {
			context.save()
			context.fillStyle = 'black'
			context.fillRect(0, 0, context.canvas.width, context.canvas.height)
			context.translate(viewportOffset.x, viewportOffset.y)
			drawingHistory.forEach(drawData => applyDrawing(drawData))
			context.restore()
		}
	}, [viewportOffset, drawingHistory, contextRef?.current])

	useEffect(() => {
		drawHistory()
	}, [viewportOffset, drawingHistory, contextRef?.current, drawHistory])

	useEffect(() => {
		const loadedImages = []
		let loadedCount = 0

		cursors.forEach((cursor, index) => {
			const image = new Image()
			image.src = `/icons/cursor-${cursor}.svg`
			loadedImages[index] = image

			image.onload = () => {
				loadedCount++
				if (loadedCount === cursors.length) {
					setCursorImages(loadedImages)
					setImagesLoaded(true)
				}
			}

			image.onerror = err => {
				console.error(`Failed to load cursor image: ${cursor}`, err)
			}
		})
	}, [])

	const drawCursors = () => {
		const context = mouseCanvasContextRef.current
		const canvas = context.canvas
		context.clearRect(-1, 0, canvas.width, canvas.height)

		let index = -1
		userCursorsRef.current.forEach(({ x, y, userSocketId }) => {
			const cursorImage = cursorImages[index % cursorImages.length]
			if (cursorImage) {
				context.drawImage(
					cursorImage,
					x + CURSOR_OFFSET_X,
					y + CURSOR_OFFSET_Y,
					CURSOR_WIDTH,
					CURSOR_HEIGHT
				)
				context.font = '13px'
				const textMetrics = context.measureText(userSocketId)
				context.fillStyle = 'rgba(254, 255, 255, 0.8)'
				context.beginPath()
				context.roundRect(
					x + 9,
					y + CURSOR_HEIGHT - 14,
					textMetrics.width + 19,
					19,
					29
				)
				context.fill()
				context.fillStyle = '#111110'
				context.fillText(userSocketId, x + 19, y + CURSOR_HEIGHT)
			}
			index++
		})
	}

	useLayoutEffect(() => {
		const context = contextRef.current
		if (!context || !imagesLoaded) return

		on('draw', drawData => {
			if (drawData.isLastPoint) {
				setDrawingHistory(prev => [...prev, currentUserPath])
				setCurrentUserPath({
					points: [],
				})
			} else {
				setCurrentUserPath(prev => ({
					isNewLine: drawData.isNewLine,
					userId: drawData.userId,
					color: drawData.color,
					points: [...prev.points, { x: drawData.x, y: drawData.y }],
					mode: drawData.mode,
				}))
				applyDrawing(currentUserPath)
			}
		})

		on('drawing-history', history => {
			setDrawingHistory(history)
			history.forEach(drawData => applyDrawing(drawData))
		})

		on('mouse-move', mouseData => {
			const { x, y, socketId } = mouseData
			userCursorsRef.current.set(socketId, { x, y, userSocketId: socketId })
			drawCursors()
		})

		on('clear-canvas', () => {
			const context = contextRef.current
			const canvas = context.canvas
			if (context) {
				context.fillStyle = CANVAS_BG
				context.fillRect(-1, 0, canvas.width, canvas.height)
			}
		})

		on('mouse-leave', data => {
			const { socketId } = data
			userCursorsRef.current.delete(socketId)
			drawCursors()
		})

		return () => {
			off('draw')
			off('mouse-move')
			off('drawing-history')
			off('clear-canvas')
			off('mouse-leave')
		}
	}, [
		on,
		off,
		contextRef?.current,
		cursorImages,
		imagesLoaded,
		currentUserPath,
	])

	return {
		applyDrawing,
		drawHistory
	}
}
