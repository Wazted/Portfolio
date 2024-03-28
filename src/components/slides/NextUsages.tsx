import { useRef, useState } from 'react'
import clsx from 'clsx'

export const NextUsages = () => {
  const divRef = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState({ x: 0, y: 0 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event
    if (!divRef.current) {
      return
    }
    const divRect = divRef.current.getBoundingClientRect()
    const divX = divRect.left + divRect.width / 2
    const divY = divRect.top + divRect.height / 2
    const distanceX = clientX - divX
    const distanceY = clientY - divY
    setDistance({ x: ~~(distanceX / 10), y: ~~(distanceY / 10) })
    console.log('distanceX', distance.x)
    console.log('distanceY', distance.y)
  }

  const siteIconeClassName =
    'rounded-[24px] bg-white shadow-lg w-44 h-44 flex justify-center items-center font-bold text-2xl'

  return (
    <div className="min-h-screen bg-amber-50 h-[calc(100vh-40px)] w-full p-4" onMouseMove={handleMouseMove}>
      <h2 className="text-2xl font-bold">Next.js Usages</h2>
      <div className="flex h-full items-center justify-center w-full">
        <ul ref={divRef} className="flex flex-row flex-wrap gap-8 justify-center max-w-[50%] w-full">
          <li
            className={clsx(
              siteIconeClassName,
              distance.x < 0 ? `-skew-x-[${distance.x * -1}deg]` : `skew-x-[${distance.x}deg]`,
              distance.y < 0 ? `-skew-y-[${distance.y * -1}deg]` : `skew-y-[${distance.y}deg]`
            )}
          >
            Site 1
          </li>
          <li className={clsx(siteIconeClassName)}>Site 2</li>
          <li className={clsx(siteIconeClassName)}>Site 3</li>
          <li className={clsx(siteIconeClassName)}>Site 4</li>
        </ul>
      </div>
    </div>
  )
}
