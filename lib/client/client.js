import io from 'socket.io-client'
import JSONTree from 'react-json-tree'
// eslint sees `React` as declared not used, react plugin is supposed to fix ?
import {
  default as React, // eslint-disable-line no-unused-vars
  Component
} from 'react'
import {
  Tabs,
  Tab,
  Alert,
  Button
} from 'react-bootstrap' // ~190kb
import cookie from 'react-cookie'
import Table from 'react-filterable-table'
import { render } from 'react-dom'

// data & log defined globally to preserve between events
let data = {
  files: 'no data yet :(',
  metadata: 'no data yet :(',
  next: '??'
}
let log = []

// set up socket
let socket = io('http://localhost:8081')
socket.on('plugin', function (update) {
  data = update
  renderApp()
})
socket.on('log', function (entry) {
  entry = /metalsmith-([a-z|-]*)\s(.*),(.*)/.exec(entry)
  if (!entry) return
  log = log.concat([{
    timestamp: new Date().toISOString().slice(11, -1),
    plugin: entry[1],
    message: entry[2],
    elapsed: entry[3]
  }])
  renderApp()
})

function renderApp () {
  render(
    <App data={data} log={log} />,
    document.getElementById('root')
  )
}

class LogWarning extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alertVisible: !cookie.load('debugUiHideWarning')
    }
  }
  render () {
    if (!this.state.alertVisible) return null
    return (
      <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss.bind(this)}>
        <h4>Not logging all the things?</h4>
        <p>
          Sadly, debug-ui cant hook debug writes, so other modules will need
          to explicitly support writing to this log :(
        </p>
        <p>
          <Button onClick={this.handleAlertDismiss.bind(this)} bsStyle="danger">Ok, got it</Button>
        </p>
      </Alert>
    )
  }
  handleAlertDismiss () {
    cookie.save('debugUiHideWarning', true, {
      path: '/',
      expires: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))
    })
    this.setState({alertVisible: false})
  }
  handleAlertShow () {
    this.setState({alertVisible: true})
  }

}

function doNext () {
  socket.emit('doNext')
}
function doAll () {
  socket.emit('doAll')
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

const App = (props) => (
  <div>
    <div className="row margin-top">
      <div className="col">
        <h2>Metalsmith Debug UI</h2>
      </div>
    </div>
    <div className="row margin-top">
      <div className="col">
        <div className="btn-group" role="group" aria-label="...">
          <button id="do-all" className="btn btn-default" onClick={doAll} type="button">Run Remaining</button>
          <button id="do-next" className="btn btn-default" onClick={doNext} type="button">Run Next ({props.data.next || 'anonymous'})</button>
        </div>
      </div>
    </div>
    <div className="row margin-top">
      <div className="col">
        <Tabs defaultActiveKey={1}>
          <Tab eventKey={1} title="Files">
            <div className="margin-top">
              <JSONTree
                data={props.data.files}
                theme={theme}
                invertTheme
              />
            </div>
          </Tab>
          <Tab eventKey={2} title="Metadata">
            <div className="margin-top">
              <JSONTree
                data={props.data.metadata}
                theme={theme}
                invertTheme
              />
            </div>
          </Tab>
          <Tab eventKey={3} title="Log">
            <div className="margin-top">
              <LogWarning />
            </div>
            <div className="margin-top">
              <Table
                keys="plugin"
                initialSort="timestamp"
                noRecordsMessage="Nothing logged yet."
                noFilteredRecordsMessage="No matches."
                data={props.log}
                fields={[
                  { name: 'timestamp' },
                  { name: 'plugin', inputFilterable: true },
                  { name: 'message', inputFilterable: true },
                  { name: 'elapsed' }
                ]}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  </div>
)
