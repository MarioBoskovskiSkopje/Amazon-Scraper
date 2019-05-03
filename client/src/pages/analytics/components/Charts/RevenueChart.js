import React, { PureComponent } from 'react'
import { Row, Col } from 'reactstrap'
import { PieChart, Pie, Sector, Cell } from 'recharts'

import './revenuechart.css'

export default class RevenueChart extends PureComponent {
  render() {
    const staticdata = [
      { name: 'Group A', qty: 400 },
      { name: 'Group B', qty: 300 },
      { name: 'Group C', qty: 300 },
      { name: 'Group D', qty: 200 },
    ]

    const { data } = this.props

    //console.log('data in revenue chart', data)
    let newData = []
    console.log(data)
    if (data[0] !== null && data[1] !== null) {
      data.map(el => {
        if (el.qty !== null) {
          newData.push({ qty: parseInt(el.qty) * el.price.split('$')[1] })
        }
      })
    }
    //console.log('newData', newData)

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const RADIAN = Math.PI / 180

    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5
      const x = cx + radius * Math.cos(-midAngle * RADIAN)
      const y = cy + radius * Math.sin(-midAngle * RADIAN)

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )
    }
    return (
      <Row>
        <PieChart width={320} height={320}>
          <Pie
            data={newData}
            cx={120}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            width={200}
            height={200}
            dataKey={'qty'}
            label={renderCustomizedLabel}
          >
            {data
              ? data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))
              : ''}
          </Pie>
        </PieChart>
      </Row>
    )
  }
}
