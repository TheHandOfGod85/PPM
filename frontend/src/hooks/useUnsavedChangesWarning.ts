import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import { useEffect } from 'react'

export default function useUnsavedChangesWarning(condition: boolean) {
  const router = useRouter()
  useEffect(() => {
    const beforeUnloadhandler = (e: BeforeUnloadEvent) => {
      if (condition) {
        e.preventDefault()
        e.returnValue = true
      }
    }
    const routeChangeStartHandler = () => {
      if (
        condition &&
        !window.confirm(
          'You have unsaved changes, do you want to leave the page?'
        )
      ) {
        nProgress.done()
        throw 'routeChange aborted'
      }
    }
    window.addEventListener('beforeunload', beforeUnloadhandler)
    router.events.on('routeChangeStart', routeChangeStartHandler)
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadhandler)
      router.events.off('routeChangeStart', routeChangeStartHandler)
    }
  }, [condition, router.events])
}
