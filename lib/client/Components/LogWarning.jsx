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
          It's possible that a plugin's output may not be captured here. If you
          find one please <a href='https://git.io/vH4DC'>log an issue</a> about
          it!
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
