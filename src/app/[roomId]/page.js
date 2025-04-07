'use client'
// import { useState, useEffect } from 'react'
// import { useSocket } from '../hooks/useSocket'
// import { useCanvas } from '../hooks/useCanvas'
// import { useDrawing } from '../hooks/useDrawing'
// import { useSocketDrawing } from '../hooks/useSocketDrawing'
// import { DrawingProvider, useDrawingContext } from '../context/DrawingContext'
// import Buttons from './components/Buttons'

// function CanvasDrawingInner() {
// 	const { canvasRef, mouseCanvasRef, localColor, setLocalColor, mode } =
// 		useDrawingContext()

// 	useSocket()
// 	const { initializeCanvas, changeLineWidth } = useCanvas()
// 	const {
// 		startDrawing,
// 		draw,
// 		stopDrawing,
// 		clearCanvas,
// 		handleMouseLeave,
// 		setMode,
// 	} = useDrawing()

// 	useSocketDrawing()

// 	useEffect(() => {
// 		initializeCanvas()
// 	}, [initializeCanvas])

// 	useEffect(() => {
// 		changeLineWidth(localColor)
// 	}, [localColor, changeLineWidth])

// 	return (
// 		<>
// 			<div className='absolute z-50'>
// 				<Buttons
// 					localColor={localColor}
// 					setLocalColor={setLocalColor}
// 					onClear={clearCanvas}
// 					mode={mode}
// 					setMode={setMode}
// 				/>
// 			</div>
// 			<canvas
// 				ref={canvasRef}
// 				style={{
// 					width: '100%',
// 					height: '100%',
// 					cursor: 'crosshair',
// 					border: '2px solid black',
// 					position: 'absolute',
// 				}}
// 			/>
// 			<canvas
// 				onMouseDown={startDrawing}
// 				onMouseMove={draw}
// 				onMouseUp={stopDrawing}
// 				onMouseOut={stopDrawing}
// 				onMouseLeave={handleMouseLeave}
// 				onTouchStart={startDrawing}
// 				onTouchMove={draw}
// 				onTouchEnd={stopDrawing}
// 				ref={mouseCanvasRef}
// 				style={{
// 					width: '100%',
// 					height: '100%',
// 					position: 'absolute',
// 					zIndex: 20,
// 					cursor: 'crosshair',
// 					border: '2px solid black',
// 				}}
// 			/>
// 		</>
// 	)
// }

export default function CanvasDrawing() {
	return (
		<div>page</div>
	)
	// return (
	// 	<DrawingProvider>
	// 		<CanvasDrawingInner />
	// 	</DrawingProvider>
	// )
}
