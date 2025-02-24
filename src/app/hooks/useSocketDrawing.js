import { CANVAS_BG } from '@/utils/colors'
import { useEffect, useRef, useState } from 'react'

const CURSOR_OFFSET_X = -18
const CURSOR_OFFSET_Y = -8
const CURSOR_WIDTH = 48
const CURSOR_HEIGHT = 48

export const useSocketDrawing = ({
	contextRef,
	mouseCanvasContextRef,
	userPaths,
	setUserPaths,
	emit,
	on,
	off,
	socketId,
}) => {
	const userCursorsRef = useRef(new Map())
	const [cursorImages, setCursorImages] = useState([])
	const [imagesLoaded, setImagesLoaded] = useState(false)

	const cursors = ['red', 'blue', 'yellow', 'green', 'orange']

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
		context.clearRect(0, 0, canvas.width, canvas.height)

		let index = 0
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
				context.font = '14px'
				const textMetrics = context.measureText(userSocketId)
				context.fillStyle = 'rgba(255, 255, 255, 0.8)'
				context.beginPath()
				context.roundRect(
					x + 10,
					y + CURSOR_HEIGHT - 15,
					textMetrics.width + 20,
					20,
					30
				)
				context.fill()
				context.fillStyle = '#111111'
				context.fillText(userSocketId, x + 20, y + CURSOR_HEIGHT)
			}
			index++
		})
	}

	useEffect(() => {
		const context = contextRef.current
		if (!context || !imagesLoaded) return
		on('draw', drawData => {
			const { x, y, isNewLine, socketId, color } = drawData
			context.strokeStyle = color
			setUserPaths(prevPaths => {
				const newPaths = new Map(prevPaths)
				if (isNewLine) {
					context.beginPath()
					context.moveTo(x, y)
					newPaths.set(socketId, { x, y })
				} else {
					const lastPos = prevPaths.get(socketId)
					if (lastPos) {
						context.beginPath()
						context.moveTo(lastPos.x, lastPos.y)
						context.lineTo(x, y)
						context.stroke()
						newPaths.set(socketId, { x, y })
					}
				}
				return newPaths
			})
		})

		on('drawing-history', history => {
			history.forEach(drawData => {
				const { x, y, socketId, isNewLine, color } = drawData
				context.strokeStyle = color
				if (isNewLine) {
					context.beginPath()
					context.moveTo(x, y)
					userPaths.set(socketId, { x, y })
				} else {
					const lastPos = userPaths.get(socketId)
					if (lastPos) {
						context.beginPath()
						context.moveTo(lastPos.x, lastPos.y)
						context.lineTo(x, y)
						context.stroke()
						userPaths.set(socketId, { x, y })
					}
				}
			})
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
				context.fillRect(0, 0, canvas.width, canvas.height)
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
	}, [on, off, contextRef?.current, cursorImages, imagesLoaded])
}
