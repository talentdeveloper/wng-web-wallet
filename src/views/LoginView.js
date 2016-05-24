import React from 'react'
import { connect } from 'react-redux'
import { Row } from 'react-flexgrid'

import PageTitle from 'components/PageTitle'

export class LoginView extends React.Component {
  render () {
    return (
      <PageTitle pageName='login'>
        <Row>
          Login
        </Row>
      </PageTitle>
    )
  }
}

export default connect()(LoginView)
