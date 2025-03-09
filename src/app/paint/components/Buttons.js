import { CANVAS_BG } from '@/utils/colors'
import { RiDragMoveFill, RiPencilFill } from 'react-icons/ri'
import { FaLongArrowAltRight, FaRegSquare, FaRegCircle } from 'react-icons/fa'
import Image from 'next/image'
import React from 'react'

function Buttons({ localColor, setLocalColor, onClear, setMode, mode }) {
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
						alt='clear'
					/>
				</button>
				<div className='bg-slate-600 h-1 my-4 rounded-full' />
				<button
					onClick={() => setMode('draw')}
					data-mode={mode}
					className='border data-[mode=draw]:border-slate-300 border-slate-500 rounded-full w-10 h-10 bg-slate-600 flex items-center justify-center'
				>
					<RiPencilFill />
				</button>
				<button
					onClick={() => setMode('line')}
					data-mode={mode}
					className='border data-[mode=line]:border-slate-300 border-slate-500 rounded-full w-10 h-10 bg-slate-600 flex items-center justify-center'
				>
					<FaLongArrowAltRight />
				</button>
				<button
					onClick={() => setMode('drag')}
					data-mode={mode}
					className='border data-[mode=drag]:border-slate-300 border-slate-500 rounded-full w-10 h-10 bg-slate-600 flex items-center justify-center'
				>
					<RiDragMoveFill />
				</button>
			</div>
		</div>
	)
}

export default Buttons
