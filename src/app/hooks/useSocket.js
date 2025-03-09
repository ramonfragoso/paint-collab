// src/hooks/useSocket.js
import { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { io } from 'socket.io-client'

let socketInstance = null

export const useSocket = (url = 'http://192.168.0.14:3000/') => {
	const [isConnected, setIsConnected] = useState(false)
	const socketRef = useRef(null)

	useEffect(() => {
		if (!socketInstance) {
			socketInstance = io(url, {
				transports: ['websocket', 'webtransport'],
			})
		}
		socketRef.current = socketInstance

		socketRef.current.on('connect', () => {
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
