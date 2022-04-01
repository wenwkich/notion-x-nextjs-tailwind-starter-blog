/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { NotionRenderer } from 'react-notion-x'

export const NotionLayout = ({ layout, children, ...rest }) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout>{children}</Layout>
}

export const NotionLayoutRenderer = ({ layout, recordMap, darkMode, ...rest }) => {
  const NotionComp = useMemo(
    () => () => <NotionRenderer recordMap={recordMap} darkMode={darkMode} />,
    [recordMap, darkMode]
  )

  return (
    <NotionLayout layout={layout} {...rest}>
      <NotionComp />
    </NotionLayout>
  )
}
