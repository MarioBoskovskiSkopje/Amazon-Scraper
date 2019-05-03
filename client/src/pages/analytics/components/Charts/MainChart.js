import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

import Widget from '../../../../components/Widget'

export default class RevenueChart extends Component {
  constructor() {
    super()

    this.state = {
      revenue: '',
    }

    this.getVal = this.getVal.bind(this)
  }

  getVal(items) {
    if (items[0] !== null && items[1] !== null) {
      if (items.length === 2) {
        let price = items[0].price.split('$')[1]
        //console.log('price', price)
        this.setState({
          revenue: parseInt(price) * Math.abs(items[0].qty - items[1].qty),
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log('nextprops', nextProps.items)
    if (nextProps.items.length === 2) {
      this.getVal(nextProps.items)
    }
  }

  render() {
    const { items } = this.props

    let itemsClone = items || []

    itemsClone['revenue'] = this.state.revenue

    itemsClone = itemsClone.map(item => {
      return { ...item, ...{ revenue: this.state.revenue } }
    })

    //console.log('itemsClone', itemsClone)

    return (
      <Widget
        bodyClass="mt"
        className="mb-xlg"
        title={
          <Row>
            <Col xs={12} sm={5}>
              <h5 style={{ paddingBottom: '15px' }}>
                Daily <span className="fw-semi-bold">Line Chart</span>
              </h5>
              <LineChart
                width={800}
                height={300}
                data={itemsClone.length === 2 ? itemsClone : items}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                isAnimationActive={false}
              >
                <XAxis dataKey="datecreated" stroke="black" />
                <YAxis stroke="black" />
                <YAxis stroke="white" />
                <CartesianGrid />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="qty"
                  stroke="black"
                  activeDot={{ r: 8 }}
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="black"
                  activeDot={{ r: 8 }}
                  dot={{ r: 6 }}
                />
                <Line type="monotone" stroke="black" activeDot={{ r: 8 }} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="asin" stroke="black" />
              </LineChart>
            </Col>
          </Row>
        }
      />
    )
  }
}
