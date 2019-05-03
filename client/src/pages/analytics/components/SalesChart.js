import React, { Component } from 'react'
import cx from 'classnames'

import s from '../Analitycs.module.scss'

class SalesChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: '',
    }
    this.sumQty = this.sumQty.bind(this)
  }

  getSum(total, num) {
    return parseInt(total) - parseInt(num)
  }
  sumQty() {
    const { data } = this.props
    let arr = []
    let res = ''
    //console.log('data in sales chart', data)
    if (data && data.length > 0) {
      data.map(el => {
        if (el !== null) {
          arr.push(el.qty)
          res = arr.reduce(this.getSum)
        }
        if (data.length === 1) {
          res = data[0].qty
        }
      })
      localStorage.setItem('revenueres', res > 0 ? res : '')
    }

    return <span>{res > 0 ? res : null}</span>
  }
  componentDidMount() {
    this.sumQty()
  }
  render() {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb">
          {this.sumQty()}
          <i className="la la-arrow-right text-success rotate-315" />
        </div>
        <div className="d-flex flex-wrap justify-content-between">
          <div className={cx('mt', s.visitElement)}>
            <h6>+830</h6>
            <p className="text-muted mb-0 mr">
              <small>DoD</small>
            </p>
          </div>
          <div className={cx('mt', s.visitElement)} />
          <div className={cx('mt', s.visitElement)}>
            <h6>4.5%</h6>
            <p className="text-muted mb-0 mr">
              <small>Rate</small>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default SalesChart
