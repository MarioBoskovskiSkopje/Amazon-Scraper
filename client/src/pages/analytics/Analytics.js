import React, { Component } from 'react'

import { Col, Row, Input } from 'reactstrap'

import Widget from '../../components/Widget'
import RevenueChart from './components/Charts/RevenueChart'
import MainChart from './components/Charts/MainChart'
import TableContainer from './components/TableContainer/TableContainer'
import CalendarComp from '../dashboard/components/calendar/Calendar'
import SearchAsinInput from './components/SearchAsinInput'
import SalesChart from './components/SalesChart'

import s from './Analitycs.module.scss'

import axios from 'axios'
import index from '../../config/index'

import './components/chart.css'

const BASE_URL = index.baseUrl

class Analytics extends Component {
  constructor() {
    super()

    this.state = {
      asinValue: '',
      urlValue: '',
      items: [],
      itemsByDate: [],
      itemByDate: [],
      date: '',
      totalQty: '',
      specificItem: [],
      data: [],
      show: false,
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.getItemsByDate = this.getItemsByDate.bind(this)
    this.getSpecificItem = this.getSpecificItem.bind(this)
    this.onHandleAsin = this.onHandleAsin.bind(this)
    this.handleClickForDropDown = this.handleClickForDropDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickForDropDown)
    this.getItems()
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickForDropDown)
  }

  handleClickForDropDown(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ show: false })
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit() {
    console.log(this.state.asinValue, this.state.urlValue)
    if (this.state.asinValue && this.state.urlValue) {
      axios
        .post(`${BASE_URL}create`, {
          asin: this.state.asinValue,
          url: this.state.urlValue,
        })
        .then(res => {
          console.log(res)
          alert('You successful added new Asin')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  onHandleAsin(el) {
    this.setState({ asinValue: el })
  }

  getSpecificItem(el) {
    const { asinValue } = this.state

    let ifInput = asinValue !== '' ? asinValue : el

    axios.get(`${BASE_URL}list/asin/${ifInput}`).then(item => {
      //console.log('item', item)
      if (item.data.length > 0) {
        this.setState({
          items: item.data,
        })
      } else {
        this.setState({
          items: [],
        })
      }
    })
  }

  getItems() {
    let arr = []
    axios.get(`${BASE_URL}list`).then(items => {
      console.log('items.data[0]', [items.data[0]])
      arr.push(items.data[0], items.data[1])
      this.setState({
        //items: arr,
        data: items.data,
      })
    })
  }

  deleteItem() {
    const { asinValue } = this.state

    if (asinValue) {
      axios.get(`${BASE_URL}stop/${asinValue}`).then(el => {
        console.log('deleted asin', asinValue)
      })
    }
  }

  getSum(total, num) {
    return total + num
  }

  getItemsByDate() {
    let date = localStorage.getItem('date')
    let secondDate = localStorage.getItem('seconddate')

    //let pastdays = localStorage.getItem('pastdays')

    // console.log('DATE', date)
    // console.log('secondDate', secondDate)

    axios.get(`${BASE_URL}list/range/?startDate=${date}&endDate=${secondDate}`).then(items => {
      //console.log('itemsfromdates', items)
      if (items.data.length > 0) {
        this.setState({
          items: items.data,
        })
      } else {
        this.setState({
          items: [],
        })
      }
    })
  }

  render() {
    let urls = [
      'Amazon.com',
      'Amazon.com.au',
      'Amazon.com.br',
      'Amazon.ca',
      'Amazon.cn',
      'Amazon.fr',
      'Amazon.de',
      'Amazon.in',
      'Amazon.it',
      'Amazon.co.jp',
      'Amazon.com.mx',
      'Amazon.es',
      'Amazon.co.uk',
    ]
    return (
      <div>
        <h1 className="page-title">Analytics</h1>
        <div>
          <div className={s.analyticsSide}>
            <Row style={{ justifyContent: 'center', paddingBottom: '15px' }}>
              <div>
                <SearchAsinInput
                  name={'Search'}
                  direction={'row'}
                  margin={'15px'}
                  onSubmit={this.getSpecificItem}
                  onChange={this.onChange}
                  value={this.state.asinValue}
                  ifIsSearch={true}
                  data={this.state.data}
                  show={this.state.show}
                />
              </div>
            </Row>

            <Row>
              <Col xs={12} xl={3} md={6}>
                <div className="pb-xlg h-100">
                  <Widget className="mb-0 h-100" bodyClass="mt-lg" title={<h5>Sales</h5>}>
                    <SalesChart data={this.state.items} />
                  </Widget>
                </div>
              </Col>
              <Col xs={12} xl={3} md={6}>
                <div className="pb-xlg h-100">
                  <Widget bodyClass="mt" className="mb-0 h-100" title={<h5>Revenue Breakdown</h5>}>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                      <ul>
                        <li>
                          <span className="dot1" />
                          Revenue
                        </li>
                      </ul>
                    </div>
                    <RevenueChart data={this.state.items} />
                  </Widget>
                </div>
              </Col>
              <Col xs={12} xl={3} md={6}>
                <Widget className="mb-xlg pt-0" bodyClass="p-0 mt-0">
                  <CalendarComp getDate={this.getItemsByDate} />
                </Widget>
              </Col>
              <Col
                xs={12}
                xl={3}
                md={6}
                style={{ display: 'flex', flexDirection: 'column-reverse', marginBottom: '200px' }}
              >
                <div>
                  <div>
                    <p>ASIN</p>
                    <SearchAsinInput
                      onChange={this.onChange}
                      name={'Create'}
                      onSubmit={this.onSubmit}
                      value={this.state.asinValue}
                      deleteItem={this.deleteItem}
                      data={this.state.data}
                      onHandleAsin={this.onHandleAsin}
                      asin={this.state.asinValue}
                      show={this.state.show}
                    />
                  </div>
                </div>
                <div style={{ paddingTop: '10px' }}>
                  <p>URL</p>
                  <Input
                    type="text"
                    placeholder="eg. Amazon.com, Amazon.ca, etc"
                    onChange={this.onChange}
                    value={this.state.urlValue}
                    defaultValue={this.state.urlValue}
                    name={'urlValue'}
                    style={{ marginBottom: '5px' }}
                    onClick={() =>
                      this.setState({
                        show: true,
                      })
                    }
                  />
                  {this.state.show ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        zIndex: '1',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '5px',
                      }}
                      ref={node => (this.wrapperRef = node)}
                    >
                      {urls.map(el => (
                        <span
                          onClick={() => this.setState({ urlValue: el })}
                          className="spanDropDown"
                          key={el}
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </Col>

              <Col xs={12}>
                <MainChart items={this.state.items} />
              </Col>
              <Col xs={12} className="mb-lg">
                <Widget
                  className="pb-0"
                  bodyClass="p-0 mt"
                  title={
                    <h4>
                      {' '}
                      Support <strong>Requests</strong>
                    </h4>
                  }
                  close
                  settings
                >
                  <TableContainer
                    data={this.state.items}
                    dataByDate={this.state.itemsByDate}
                    specificItem={this.state.specificItem}
                  />
                </Widget>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default Analytics
