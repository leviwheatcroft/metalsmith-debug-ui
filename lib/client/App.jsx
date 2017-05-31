import {
  Component,
  default as React // eslint-disable-line
} from 'react'
import {
  Tabs,
  Tab
} from 'react-bootstrap' // ~190kb
import TreeByPlugin from './Components/TreeByPlugin'
import Log from './Components/Log'
import request from 'browser-request'
import update from 'immutability-helper'

export default class App extends Component {
  constructor () {
    super()
    const app = this
    this.state = {
      plugins: [],
      log: []
    }
    request('/debug-ui/data.json', (err, response, body) => {
      if (err) throw new Error(err)
      body = JSON.parse(body)
      app.setState(body)
    })
  }
  updateState (object, spec, callback = () => {}) {
    this.setState(update(object, spec), callback)
  }
  render () {
    return (
      <div>
        <div className="row margin-top">
          <div className="col">
            <h2>Metalsmith Debug UI</h2>
          </div>
        </div>
        <div className="row margin-top">
          <div className="col">
            <Tabs defaultActiveKey={1} id='main-nav-tabs'>
              <Tab eventKey={1} title="Files">
                <TreeByPlugin
                  plugins={this.state.plugins}
                  dataProperty={'files'}
                />
              </Tab>
              <Tab eventKey={2} title="Metadata">
                <TreeByPlugin
                  plugins={this.state.plugins}
                  dataProperty={'metadata'}
                />
              </Tab>
              <Tab eventKey={3} title="Log">
                <Log
                  log={this.state.log}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}
