'use client'
import { CANVAS_BG } from '@/utils/colors'
import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useCanvas } from '../hooks/useCanvas'
import { useSocketDrawing } from '../hooks/useSocketDrawing'
import Buttons from './components/Buttons'

export default function CanvasDrawing() {
	const [localColor, setLocalColor] = useState('#ffffff')
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
	const [canvasSize, setCanvasSize] = useState({ width: 3000, height: 3000 })
	const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 })
	const [mode, setMode] = useState('line')

	const { emit, on, off, socketId } = useSocket()
	const [userPaths, setUserPaths] = useState(new Map())

	const {
		canvasRef,
		mouseCanvasRef,
		isDrawingRef,
		isDrawingLineRef,
		contextRef,
		initializeCanvas,
		changeLineWidth,
		mouseCanvasContextRef,
	} = useCanvas(localColor)

	useSocketDrawing({
		contextRef,
		mouseCanvasContextRef,
		userPaths,
		setUserPaths,
		emit,
		on,
		off,
		socketId,
		mouseCanvasRef,
		viewportOffset,
	})

	useEffect(() => {
		initializeCanvas()
	}, [initializeCanvas])

	useEffect(() => {
		changeLineWidth(localColor)
	}, [localColor, changeLineWidth])

	const startDrawing = e => {
		let clientX, clientY
		if (e.touches) {
			clientX = e.touches[0].clientX
			clientY = e.touches[0].clientY
		} else {
			clientX = e.clientX
			clientY = e.clientY
		}
		if (e.button === 1 || (e.button === 0 && e.altKey) || mode === "drag") {
			setIsDragging(true)
			setDragStart({ x: clientX, y: clientY })
			e.preventDefault()
		} else {
			const canvas = canvasRef.current
			const context = contextRef.current

			if (!canvas || !context) return

			const rect = canvas.getBoundingClientRect()
			const x = clientX - rect.left
			const y = clientY - rect.top
			if (mode === 'line') {
				context.strokeStyle = localColor
				context.beginPath()
				context.moveTo(x, y)
				console.log('hreeeee')
				isDrawingLineRef.current = true
				return
			}

			context.strokeStyle = localColor
			context.beginPath()
			context.moveTo(x, y)

			emit('draw', {
				x,
				y,
				isNewLine: true,
				userId: socketId,
				color: localColor,
				viewportOffset,
			})
			isDrawingRef.current = true
		}
	}

	const trackMouseMove = (clientX, clientY) => {
		const canvas = mouseCanvasRef.current
		const rect = canvas.getBoundingClientRect()
		const x = clientX - rect.left
		const y = clientY - rect.top
		emit('mouse-move', { x, y, socketId, viewportOffset })
	}

	const draw = e => {
		let clientX, clientY
		if (e.touches) {
			clientX = e.touches[0].clientX
			clientY = e.touches[0].clientY
		} else {
			clientX = e.clientX
			clientY = e.clientY
		}
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

		const rect = canvas.getBoundingClientRect()
		const x = clientX - rect.left
		const y = clientY - rect.top

		context.lineTo(x, y)
		context.stroke()

		emit('draw', {
			x,
			y,
			isNewLine: false,
			userId: socketId,
			color: localColor,
			viewportOffset,
		})
	}

	const stopDrawing = e => {
		e.preventDefault()
		if (mode === 'line' && !isDragging) {
			let clientX, clientY
			if (e.touches) {
				clientX = e.touches[0].clientX
				clientY = e.touches[0].clientY
			} else {
				clientX = e.clientX
				clientY = e.clientY
			}
			if (!isDrawingLineRef.current) return
			const canvas = canvasRef.current
			const rect = canvas.getBoundingClientRect()
			const context = contextRef.current
			const x = clientX - rect.left
			const y = clientY - rect.top
			context.lineTo(x, y)
			context.stroke()
			isDrawingLineRef.current = false
			return
		}
		setIsDragging(false)
		isDrawingRef.current = false
	}

	const clearCanvas = () => {
		const canvas = canvasRef.current
		const context = contextRef.current
		if (context) {
			context.fillStyle = CANVAS_BG
			context.fillRect(0, 0, canvas.width, canvas.height)
		}
		emit('clear-canvas')
	}

	const handleMouseLeave = () => {
		emit('mouse-leave', { socketId })
	}

	return (
		<>
			<div className='absolute z-50'>
				<Buttons
					localColor={localColor}
					setLocalColor={setLocalColor}
					onClear={clearCanvas}
					mode={mode}
					setMode={setMode}
				/>
			</div>
			<canvas
				ref={canvasRef}
				style={{
					width: '100%',
					height: '100%',
					cursor: 'crosshair',
					border: '2px solid black',
					position: 'absolute',
				}}
			/>
			<canvas
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseOut={stopDrawing}
				onMouseLeave={handleMouseLeave}
				onTouchStart={startDrawing}
				onTouchMove={draw}
				onTouchEnd={stopDrawing}
				ref={mouseCanvasRef}
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					zIndex: 20,
					cursor: 'crosshair',
					border: '2px solid black',
				}}
			/>
		</>
	)
}
