import React from 'react'

import Hammer from 'rc-hammerjs'

import Analytics from '../../pages/analytics'

import s from './Layout.module.scss'

class Layout extends React.Component {
  render() {
    return (
      <div className={s.wrap}>
        <Hammer>
          <main className={s.content}>
            <Analytics />
          </main>
        </Hammer>
      </div>
    )
  }
}

export default Layout
