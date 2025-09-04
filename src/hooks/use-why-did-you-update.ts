import { useEffect, useRef } from 'react'

export function useWhyDidYouUpdate(componentName: string, props: any) {
  const previousProps = useRef(props)

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changes: Record<string, any> = {}

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changes).length > 0) {
        console.log(`[${componentName}] changed:`, changes)
      }
    }

    previousProps.current = props
  }, [props, componentName])
}
