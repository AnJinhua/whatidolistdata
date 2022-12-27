import React from 'react'

import HeaderTemplate from './template/header'
import FooterTemplate from './template/footer'

const App = (props) => {
  return (
    <div>
      <HeaderTemplate logo='What i do' />
      {props.children}
      <FooterTemplate />
    </div>
  )
}

export default App
