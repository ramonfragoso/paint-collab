// src/hooks/useSocket.js
import { useEffect, useCallback, useRef, useState, useMemo, useLayoutEffect } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

export const useSocket = (url = 'http://34.235.155.158') => {
	const [isConnected, setIsConnected] = useState(false)
	const socketRef = useRef(null)

	useLayoutEffect(() => {
		if (!socketInstance) {
			socketInstance = io(url, {
				transports: ['websocket', 'webtransport'],
			})
		}
		socketRef.current = socketInstance

		socketRef.current.on('connect', (connectData) => {
			setIsConnected(true)
		})

		socketRef.current.on('disconnect', () => {
			setIsConnected(false)
		})

		return () => {
			socketRef.current?.disconnect()
		}
	}, [url])

	const emit = useCallback((eventName, data) => {
		socketRef.current?.emit(eventName, data)
	}, [])

	const on = useCallback((eventName, callback) => {
		socketRef.current?.on(eventName, callback)
	}, [])

	const off = useCallback((eventName, callback) => {
		socketRef.current?.off(eventName, callback)
	}, [])

	const socketId = useMemo(
		() => socketRef?.current?.id,
		[socketRef?.current?.id]
	)

	return {
		socket: socketRef.current,
		isConnected,
		emit,
		on,
		off,
		socketId,
	}
}
