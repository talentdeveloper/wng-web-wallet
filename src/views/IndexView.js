import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-flexgrid'

export class IndexView extends React.Component {
  render () {
    return (
      <Row>
        Test
      </Row>
    )
  }
}

export default connect()(IndexView)
