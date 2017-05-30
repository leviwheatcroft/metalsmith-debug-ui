import {
  Component,
  default as React // eslint-disable-line
} from 'react'
import cookie from 'react-cookie'
import {
  Alert,
  Button
} from 'react-bootstrap'

export default class LogWarning extends Component {
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
          Sadly, debug-ui cant hook writes to debug, so for now other modules
          will need to explicitly support writing to this log, which is probably
          not going to happen :(
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
