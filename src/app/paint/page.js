'use client'
import { CANVAS_BG } from '@/utils/colors'
import { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../hooks/useSocket'
import { useCanvas } from '../hooks/useCanvas'
import { useSocketDrawing } from '../hooks/useSocketDrawing'
import Buttons from './components/Buttons'

export default function CanvasDrawing() {
	const [localColor, setLocalColor] = useState('#ffffff')
	const { emit, on, off, socketId } = useSocket()
	const [userPaths, setUserPaths] = useState(new Map())

	const {
		canvasRef,
		mouseCanvasRef,
		isDrawingRef,
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
	})

	useEffect(() => {
		initializeCanvas()
	}, [initializeCanvas])

	useEffect(() => {
		changeLineWidth(localColor)
	}, [localColor, changeLineWidth])

	const startDrawing = e => {
		const canvas = canvasRef.current
		const context = contextRef.current

		if (!canvas || !context) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		context.strokeStyle = localColor
		context.beginPath()
		context.moveTo(x, y)
		emit('draw', {
			x,
			y,
			isNewLine: true,
			userId: socketId,
			color: localColor,
		})
		isDrawingRef.current = true
	}

	const trackMouseMove = e => {
		const canvas = mouseCanvasRef.current
		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		emit('mouse-move', { x, y, socketId })
	}

	const draw = e => {
		trackMouseMove(e)
		if (!isDrawingRef.current) return

		const canvas = canvasRef.current
		const context = contextRef.current
		if (!canvas || !context) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		context.lineTo(x, y)
		context.stroke()
		emit('draw', {
			x,
			y,
			isNewLine: false,
			userId: socketId,
			color: localColor,
		})
	}

	const stopDrawing = () => {
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
