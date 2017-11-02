import {
  Component,
  default as React // eslint-disable-line
} from 'react'
import PropTypes from 'prop-types'
import Table from 'react-filterable-table'
import LogWarning from './LogWarning'


import styles from 'react-filterable-table/dist/style.css'

export default class Log extends Component {
  render () {
    let table
    if (this.props.log.length) {
      table = (
        <Table
          keys="plugin"
          initialSort="timestamp"
          noRecordsMessage="Nothing logged yet."
          noFilteredRecordsMessage="No matches."
          data={this.props.log}
          fields={[
            { name: 'timestamp' },
            { name: 'plugin', inputFilterable: true },
            { name: 'message', inputFilterable: true },
            { name: 'elapsed' }
          ]}
        />
      )
    } else {
      table = (
        <p>No logs yet</p>
      )
    }
    return (
      <div className="container">
        <div className="row margin-top">
          <LogWarning />
        </div>
        <div className="row margin-top">
          {table}
        </div>
      </div>
    )
  }
}

Log.propTypes = {
  log: PropTypes.array.isRequired
}
