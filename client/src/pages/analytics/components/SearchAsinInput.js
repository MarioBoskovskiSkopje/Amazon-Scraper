import React, { Component } from 'react'

import { Input, Button } from 'reactstrap'

import '../components/chart.css'

import image from '../../../images/search-icon.png'

class SearchAsinInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      asinValue: '',
      show: false,
    }
    this.handleClickForDropDown = this.handleClickForDropDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickForDropDown)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickForDropDown)
  }

  handleClickForDropDown(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ show: false })
    }
  }

  render() {
    const { direction = 'column', margin = 0, styleForInput, ifIsSearch, data } = this.props

    let asins = data.map(el => el.asin)

    let uniqueAsins = asins.filter(function(elem, index, self) {
      return index === self.indexOf(elem)
    })

    return (
      <div style={{ display: 'flex', flexDirection: direction }}>
        {ifIsSearch === true ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <input
                type="text"
                placeholder="Select Asin"
                onChange={this.props.onChange}
                value={this.props.asinValue}
                name={'asinValue'}
                className="inputforsearching"
                onClick={() =>
                  this.setState({
                    show: true,
                  })
                }
                autoComplete={'false'}
              />

              <Button
                color="gray"
                style={{
                  marginLeft: margin,
                  width: '68px',
                  backgroundColor: '#5b636c',
                  border: 0,
                }}
                className="btnForSearching"
                onClick={this.props.onSubmit}
              >
                <img src={image} style={{ width: '20px', height: '20px' }} />
              </Button>
            </div>
            <div>
              {this.state.show ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '85px',
                    position: 'absolute',
                    zIndex: '1',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '5px',
                  }}
                  ref={node => (this.wrapperRef = node)}
                >
                  {uniqueAsins.map(el => {
                    return (
                      <span
                        onClick={() => {
                          this.setState({ show: false }, () => this.props.onSubmit(el))
                        }}
                        value={el}
                        className="spanDropDown"
                        key={el}
                      >
                        {el}
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <div>
              <Input
                type="text"
                placeholder="ASIN NUMBER"
                onChange={this.props.onChange}
                value={this.props.asin}
                //defaultValue={this.props.asin}
                name={'asinValue'}
                onClick={() =>
                  this.setState({
                    show: true,
                  })
                }
                autoComplete={'false'}
              />
              <Button
                color="gray"
                style={{
                  marginTop: '15px',
                  marginRight: '10px',
                  marginLeft: margin,
                  width: '68px',
                }}
                onClick={this.props.onSubmit}
              >
                {this.props.name}
              </Button>
            </div>
            <div>
              {this.state.show ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '-50px',
                    position: 'absolute',
                    zIndex: '1',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '5px',
                  }}
                  ref={node => (this.wrapperRef = node)}
                >
                  {uniqueAsins.map(el => {
                    return (
                      <span
                        onClick={() => this.props.onHandleAsin(el)}
                        value={el}
                        className="spanDropDown"
                        key={el}
                      >
                        {el}
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </div>
        )}
        <div>
          {this.props.deleteItem ? (
            <Button color="gray" style={{ marginTop: '15px' }} onClick={this.props.deleteItem}>
              Delete
            </Button>
          ) : null}
        </div>
      </div>
    )
  }
}

export default SearchAsinInput
