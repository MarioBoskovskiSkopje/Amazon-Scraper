import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Table } from 'reactstrap'

import s from './TableContainer.module.scss'

class TableContainer extends PureComponent {
  render() {
    const { data } = this.props
    const items = localStorage.getItem('revenueres')
    //console.log('data for table', data)

    return (
      <Table className={cx('mb-0', s.table)} borderless responsive>
        <thead>
          <tr className="text-white">
            <th scope="col">
              <span className="pl-2">Date</span>
            </th>
            <th scope="col">
              <span className="pl-2">Units Sold</span>
            </th>
            <th scope="col">
              <span className="pl-2">Qty</span>
            </th>
            <th scope="col">
              <span className="pl-2">BSR</span>
            </th>
            <th scope="col">
              <span className="pl-2">Asin</span>
            </th>
            <th scope="col">
              <span className="pl-2">Price</span>
            </th>
            <th scope="col">
              <span className="pl-2">Revenue</span>
            </th>
            <th scope="col">
              <span className="pl-2">Reviews</span>
            </th>
            <th scope="col">
              <span className="pl-2">Review Rating</span>
            </th>
            <th scope="col">
              <span className="pl-2">Price/Reviews</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 && data[0] !== null && data !== undefined
            ? data.map(el => (
                <tr key={el._id}>
                  <td className="pl-3">{el.datecreated}</td>
                  <td>{el.qty}</td>

                  <td>{el.badgebestSeller}</td>
                  <td>{el.asin}</td>
                  <td>{el.price}</td>
                  <td>
                    {isNaN(el.price.split('$')[1] * el.qty) ? '' : el.price.split('$')[1] * el.qty}
                  </td>
                  <td>{el.reviews}</td>
                  <td>{el.salesStars}</td>
                  <td>{(parseInt(el.reviews.split('customer')[0]) / el.qty).toFixed(2)}</td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    )
  }
}

export default TableContainer
