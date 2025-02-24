import { CANVAS_BG } from '@/utils/colors'
import Image from 'next/image'
import React from 'react'

function Buttons({ localColor, setLocalColor, onClear }) {
	return (
		<div className='relative'>
			<div className='absolute bg-gray-800 p-2 rounded-full flex flex-col gap-2 left-8 top-8'>
				<button
					onClick={() => setLocalColor('#dc2626')}
					data-color={localColor}
					className='border border-gray-500 rounded-full w-10 h-10 bg-red-600 data-[color=#dc2626]:border-white shadow-white'
				/>
				<button
					onClick={() => setLocalColor('#16a34a')}
					data-color={localColor}
					className='border border-gray-500 rounded-full w-10 h-10 bg-green-600 data-[color=#16a34a]:border-white'
				/>
				<button
					onClick={() => setLocalColor('#2563eb')}
					data-color={localColor}
					className='border border-gray-500 rounded-full w-10 h-10 bg-blue-600 data-[color=#2563eb]:border-white'
				/>
				<button
					onClick={() => setLocalColor('#ffffff')}
					data-color={localColor}
					className='border border-gray-500 rounded-full w-10 h-10 bg-white data-[color=#ffffff]:border-white'
				/>
				<button
					onClick={() => setLocalColor(CANVAS_BG)}
					data-color={localColor}
					className={`border border-gray-500 rounded-full w-10 h-10 bg-[${CANVAS_BG}] data-[color=${CANVAS_BG}]:border-white`}
				/>
				<button
					onClick={() => onClear()}
					data-color={localColor}
					className={`border border-gray-500 rounded-full w-10 h-10 bg-gray-500 flex items-center justify-center`}
				>
					<Image
						src='/icons/trash.png'
						className='w-6 h-6'
						width={1000}
						height={1000}
            alt="clear"
					/>
				</button>
			</div>
		</div>
	)
}

export default Buttons
