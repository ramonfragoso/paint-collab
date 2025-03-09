'use client'
import React, { createContext, useContext, useState, useRef } from 'react'
import { CANVAS_BG } from '@/utils/colors'

const DrawingContext = createContext(null)

export function DrawingProvider({ children }) {
	// Canvas references
	const canvasRef = useRef(null)
	const mouseCanvasRef = useRef(null)
	const contextRef = useRef(null)
	const mouseCanvasContextRef = useRef(null)

	// Drawing state
	const [localColor, setLocalColor] = useState('#ffffff')
	const [mode, setMode] = useState('draw')
	const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 })
	const [userPaths, setUserPaths] = useState(new Map())

	// Drawing references
	const isDrawingRef = useRef(false)
	const isDrawingLineRef = useRef(false)

	// Socket state
	const userCursorsRef = useRef(new Map())
	const [drawingHistory, setDrawingHistory] = useState([])

	const value = {
		// Canvas refs
		canvasRef,
		mouseCanvasRef,
		contextRef,
		mouseCanvasContextRef,

		// Drawing state
		localColor,
		setLocalColor,
		mode,
		setMode,
		viewportOffset,
		setViewportOffset,
		userPaths,
		setUserPaths,

		// Drawing refs
		isDrawingRef,
		isDrawingLineRef,
		userCursorsRef,
		drawingHistory,
		setDrawingHistory,
	}

	return (
		<DrawingContext.Provider value={value}>{children}</DrawingContext.Provider>
	)
}

export function useDrawingContext() {
	const context = useContext(DrawingContext)
	if (!context) {
		throw new Error('useDrawingContext must be used within a DrawingProvider')
	}
	return context
}
