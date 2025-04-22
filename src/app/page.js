'use client'
import Image from 'next/image'

export default function Home() {
	window.location.href = '/paint'
	const createNewRoom = async () => {
		// try {
		// 	const response = await fetch('/api/create-new-room', {
		// 		method: 'POST',
		// 	})
		// 	if (!response.ok) {
		// 		throw new Error('Failed to create room')
		// 	}
		// 	const { roomId } = await response.json()
		// 	window.location.href = `/${roomId}`
		// } catch (error) {
		// 	console.error('Error creating room:', error)
		// }
	}

	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
				<Image
					src='/images/logo.png'
					alt='SketcHere'
					width={500}
					height={500}
				/>

				<div className='flex flex-col w-full items-center'>
					<div className='flex flex-col p-10 gap-5'>
						<button
							className='p-5 border border-slate-400 text-3xl rotate-2'
							onClick={createNewRoom}
						>
							Create New Room
						</button>

						{/* <button className='p-5 border border-slate-400 text-3xl -rotate-1'>
							Join Room
						</button> */}
					</div>
				</div>
			</main>
			<footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
		</div>
	)
}
