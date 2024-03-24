import { useMediaQuery } from '@react-hook/media-query'

const useDeviceBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 375px)')
  const isTablet = useMediaQuery('(min-width: 376px) and (max-width: 768px)')
  const isLaptop = useMediaQuery('(min-width: 1024px)')

  return { isMobile, isTablet, isLaptop }
}

export default useDeviceBreakpoints
