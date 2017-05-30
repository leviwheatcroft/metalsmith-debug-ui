import {
  Component,
  default as React // eslint-disable-line
} from 'react'
// import update from 'immutability-helper'
import PropTypes from 'prop-types'
import {
  Button
} from 'react-bootstrap'

export default class Plugin extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }
  // updateState (...args) {
  //   const callback = args.pop()
  //   this.setstate(update(...args), callback)
  // }
  onClick () {
    this.props.setActivePlugin(this.props.idx)
  }
  render () {
    return (
      <Button
        className={this.props.isActive ? 'active' : ''}
        onClick={this.onClick}
      >
        {this.props.fnName}
      </Button>
    )
    // if (this.props.appearances < 2 && !this.props.showSingles) return null
    // return (
    //   <Button
    //     className={this.state.isActive ? 'active' : ''}
    //     onClick={this.onClick}
    //   >
    //     {this.props.name}
    //     <Badge>{this.props.appearances}</Badge>
    //   </Button>
    // )
  }
}
Plugin.propTypes = {
  fnName: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
  setActivePlugin: PropTypes.func.isRequired
}
