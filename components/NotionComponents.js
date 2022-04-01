/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { NotionRenderer } from 'react-notion-x'
import dynamic from 'next/dynamic'

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then((m) => m.Code))
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then((m) => m.Collection)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf), {
  ssr: false,
})
const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then((m) => m.Modal), {
  ssr: false,
})

export const NotionLayout = ({ layout, children, ...rest }) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout {...rest}>{children}</Layout>
}

export const NotionLayoutRenderer = ({ layout, recordMap, darkMode, ...rest }) => {
  const NotionComp = useMemo(
    () => () =>
      (
        <NotionRenderer
          recordMap={recordMap}
          darkMode={darkMode}
          components={{
            Code,
            Equation,
            Modal,
            Pdf,
          }}
        />
      ),
    [recordMap, darkMode]
  )

  return (
    <NotionLayout layout={layout} {...rest}>
      <NotionComp />
    </NotionLayout>
  )
}
