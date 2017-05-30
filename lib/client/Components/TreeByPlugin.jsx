import {
  Component,
  default as React // eslint-disable-line
} from 'react'
import update from 'immutability-helper'
// import 'isomorphic-fetch'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import PluginList from './PluginList'
// import {
//   Button,
//   Badge
// } from 'react-bootstrap'

export default class TreeByPlugin extends Component {
  constructor (props) {
    super(props)
    this.state = { activeIdx: 0 }
    // this.onClick = this.onClick.bind(this)
    this.setActivePlugin = this.setActivePlugin.bind(this)
  }
  updateState (object, spec, callback = () => {}) {
    this.setState(update(object, spec), callback)
  }
  // onClick () {
  //   this.props.setKeywordState(this.props.name, !this.state.isActive)
  //   this.updateState(this.state, {isActive: {$set: !this.state.isActive}})
  // }
  setActivePlugin (idx) {
    // this.props.setActivePlugin(idx)
    this.updateState(this.state, {activeIdx: {$set: idx}})
  }
  render () {
    let pluginList
    let jsonTree
    if (this.props.plugins.length) {
      pluginList = (
        <PluginList
          activeIdx={this.state.activeIdx}
          plugins={this.props.plugins}
          setActivePlugin={this.setActivePlugin}
        />
      )
      jsonTree = (
        <JSONTree
          data={this.props.plugins[this.state.activeIdx][this.props.dataProperty]}
          theme={theme}
          invertTheme
        />
      )
    } else {
      pluginList = (
        <p>Waiting for plugins</p>
      )
      jsonTree = (
        <p>Waiting for data</p>
      )
    }
    return (
      <div className="container margin-top">
        <div className="row">
          <div className="col-md-2">
            {pluginList}
          </div>
          <div className="col-md-10">
            {jsonTree}
          </div>
        </div>
      </div>
    )
  }
}

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}
TreeByPlugin.propTypes = {
  plugins: PropTypes.array.isRequired,
  dataProperty: PropTypes.string.isRequired
}
