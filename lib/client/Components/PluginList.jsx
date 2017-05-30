import {
  Component,
  default as React // eslint-disable-line
} from 'react'
// import update from 'immutability-helper'
// import 'isomorphic-fetch'
import PropTypes from 'prop-types'
import Plugin from './Plugin'
// import {
//   Button,
//   Badge
// } from 'react-bootstrap'

export default class PluginList extends Component {
  // constructor (props) {
  //   super(props)
  // }
  // updateState (...args) {
  //   const callback = args.pop()
  //   this.setstate(update(...args), callback)
  // }
  // onClick () {
  //   this.props.setKeywordState(this.props.name, !this.state.isActive)
  //   this.updateState(this.state, {isActive: {$set: !this.state.isActive}})
  // }
  // setActivePlugin (idx) {
  //   this.props.setActivePlugin(idx)
  //   this.updateState(this.state, {activeIdx: {$set: idx}})
  // }
  render () {
    const plugins = this.props.plugins.map((plugin, idx) => {
      return (
        <Plugin
          fnName={plugin.fnName}
          isActive={this.props.activeIdx === idx}
          setActivePlugin={this.props.setActivePlugin}
          idx={idx}
          key={idx}
        />
      )
    }) || ''
    return (
      <div className="btn-group-vertical" role="group" aria-label="...">
        {plugins}
      </div>
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
PluginList.propTypes = {
  plugins: PropTypes.array.isRequired,
  activeIdx: PropTypes.number.isRequired,
  setActivePlugin: PropTypes.func.isRequired
}
