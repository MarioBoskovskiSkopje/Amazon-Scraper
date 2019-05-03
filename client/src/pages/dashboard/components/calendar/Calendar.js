import React, { Component } from 'react'
import cx from 'classnames'
import Calendar from 'react-calendar'
import '../../../../styles/calendar.css'

import moment from 'moment'

class CalendarComp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      date: new Date(),
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange = date => {
    this.setState({ date })

    //console.log('DATE IN CALENDAR', date)

    localStorage.setItem('date', moment(date[0]).format('YYYY/MM/DD'))
    localStorage.setItem('seconddate', moment(date[1]).format('YYYY/MM/DD'))

    // this.takePastDays(date)
    this.props.getDate()
  }

  takePastDays(date) {
    let calc = date - 604800000
    let pastdays = moment(calc).format('YYYY/MM/DD')

    //console.log(pastdays)
    localStorage.setItem('pastdays', pastdays)
  }

  render() {
    return (
      <div>
        <div>
          <div className={cx('calendar', { 'calendar-white': this.props.white })}>
            <Calendar onChange={this.onChange} value={this.state.date} selectRange={true} />
          </div>
        </div>
      </div>
    )
  }
}

export default CalendarComp
