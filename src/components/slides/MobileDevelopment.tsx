import { Montserrat } from 'next/font/google'
import { useState } from 'react'
import clsx from 'clsx'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

const mobileAppList = [
  {
    name: 'Savana',
    description: 'Savana description',
    image: '/images/savana.png'
  },
  {
    name: 'Toukan',
    description: 'Toukan description',
    image: '/images/toukan.png'
  }
]

export const MobileDevelopment = () => {
  const [selectedApp, setSelectedApp] = useState(0)

  return (
    <div className={montserrat.className + ' bg-red-100 text-white h-[calc(100vh-40px)] w-full p-4 relative'}>
      <div className="flex flex-col h-full w-full">
        <h2 className="text-2xl font-bold top-2 left-4">Mobile Development</h2>
        <div className="flex items-center relative w-full h-2/3 tablet:h-full justify-around">
          <div className="text-xl flex flex-col w-full tablet:w-1/2 tablet:mx-10 items-center justify-center bg-blue-100 py-20 rounded-2xl shadow-inner h-2/3">
            <p>aaaaaaaaaaa</p>
            <p>aaaaaaaaaaa</p>
            <p>aaaaaaaaaaa</p>
            <p>aaaaaaaaaaa</p>
            <p>aaaaaaaaaaa</p>
            <div className="flex flex-row">
              <button
                className="bg-blue-500 text-white rounded-full px-4 py-3"
                onClick={() => setSelectedApp(selectedApp - 1)}
              >
                {'<'}
              </button>
              <button
                className="bg-blue-500 text-white rounded-full px-4 py-3"
                onClick={() => setSelectedApp(selectedApp + 1)}
              >
                {'>'}
              </button>
            </div>
          </div>
          <div className="flex w-1/2 h-2/3 items-center relative">
            {mobileAppList.map((app, index) => {
              return (
                <img
                  src={mobileAppList[index].image}
                  alt="Savana"
                  className={clsx(
                    'h-[98%] absolute top-0 left-[calc(50%-123px)] rounded-[40px] py-1 px-2 transition-all',
                    index === selectedApp ? 'opacity-100' : 'opacity-0'
                  )}
                />
              )
            })}
            <img
              src="/images/iphone-outline.png"
              alt="iPhone outline"
              className="h-full absolute top-0 left-[calc(50%-120px)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
