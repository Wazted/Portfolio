import { useRef, useState } from 'react'
import clsx from 'clsx'
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef'
import { VT323 } from 'next/font/google'

const vt323 = VT323({ subsets: ['latin'], weight: ['400'] })

const siteList = [
  {
    name: 'Site 1',
    url: 'https://site1.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-test.png'
  },
  {
    name: 'Site 2',
    url: 'https://site2.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-2-test.png'
  },
  {
    name: 'Site 3',
    url: 'https://site3.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-3-test.png'
  },
  {
    name: 'Site 4',
    url: 'https://site4.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-4-test.png'
  },
  {
    name: 'Site 5',
    url: 'https://site3.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-3-test.png'
  },
  {
    name: 'Site 6',
    url: 'https://site4.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-4-test.png'
  },
  {
    name: 'Site 7',
    url: 'https://site3.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-3-test.png'
  },
  {
    name: 'Site 8',
    url: 'https://site4.com',
    description: 'Site 1 description',
    stack: ['Next.js', 'TailwindCSS'],
    image: '/images/site-4-test.png'
  }
]

export const WebDevelopment = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [selectedSite, setSelectedSite] = useState<number>(0)
  const [showModal, setShowModal] = useState<boolean>(false)

  const selectSite = (index: number) => {
    if (showModal) {
      setShowModal(false)
      return
    }
    setSelectedSite(index)
    setShowModal(true)
  }

  const unselectSite = () => {
    setShowModal(false)
  }

  useClickOutsideRef(modalRef, unselectSite)

  const siteIconeClassName =
    'rounded-[24px] bg-gray-900 shadow-md flex w-20 h-20 tablet:w-40 tablet:h-40 justify-center items-center font-bold text-2xl hover:shadow-xl hover:shadow-cyan-500/50 transition-all ease-in-out cursor-pointer'

  return (
    <div className={vt323.className + ' bg-gray-950 text-white h-[calc(100vh-40px)] w-full p-4 relative'}>
      <div className="flex flex-col h-full items-center justify-center w-full">
        <h2 className="text-2xl font-bold absolute top-2 left-4">Web Development</h2>
        <ul className="flex flex-row flex-wrap gap-8 justify-center items-center max-w-[75%] transition-all ease-in-out max-h-[75%]">
          {siteList.map((site, index) => (
            <li key={'site-' + index} className={clsx(siteIconeClassName)} onClick={() => selectSite(index)}>
              {site.name}
            </li>
          ))}
        </ul>
        <div
          ref={modalRef}
          className={clsx(
            'flex flex-col transition-all duration-500 ease-in-out h-[75%] tablet:h-[80%] w-[80%] bg-black bg-opacity-70 rounded-md absolute overflow-hidden shadow-2xl shadow-cyan-500/50',
            showModal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[100vh]'
          )}
        >
          <div className="w-full h-8 bg-gray-900 flex items-center p-2">
            <button className="rounded-full bg-red-500 w-4 h-4" onClick={unselectSite} />
          </div>
          <div className="px-8 py-2 flex flex-col justify-items-start">
            <img
              className="max-h-[30vh] self-center"
              src={siteList[selectedSite]?.image}
              alt={siteList[selectedSite]?.name}
            />
            <h3 className="text-2xl">{siteList[selectedSite]?.name}</h3>
            <a className="underline pointer text-xl" target="_blank" href={siteList[selectedSite]?.url}>
              {siteList[selectedSite]?.url}
            </a>
            <ul className="list-disc list-inside">
              Stack :{siteList[selectedSite]?.stack.map((stack, index) => <li key={'stack-' + index}>{stack}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
