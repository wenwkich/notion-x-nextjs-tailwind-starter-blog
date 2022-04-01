/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { NotionRenderer } from 'react-notion-x'

export const NotionLayout = ({ layout, ...rest }) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout {...rest} />
}

export const NotionLayoutRenderer = ({ layout, recordMap, theme, ...rest }) => {
  const NotionComp = useMemo(
    () => () => <NotionRenderer recordMap={recordMap} darkMode={theme === 'dark'} />,
    [recordMap, theme]
  )

  return (
    <NotionLayout layout {...rest}>
      <NotionComp />
    </NotionLayout>
  )
}
