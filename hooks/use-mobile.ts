import * as React from "react"

// Defines the breakpoint for mobile devices.
const MOBILE_BREAKPOINT = 768

/**
 * A custom React hook that detects if the user is on a mobile device.
 * @returns {boolean} - True if the user is on a mobile device, false otherwise.
 */
export function useIsMobile() {
  // State to store whether the user is on a mobile device.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Media query to check if the screen width is less than the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Function to update the isMobile state when the screen width changes.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add a listener to the media query to detect changes in the screen width.
    mql.addEventListener("change", onChange)

    // Set the initial value of the isMobile state.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function to remove the event listener when the component unmounts.
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
