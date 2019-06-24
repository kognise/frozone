import React from 'react'
export default React.createContext(null)
export interface ContextValue {
  head: any[]
  useLinkSuffix: boolean
}