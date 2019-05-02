/*
 * This program depicts the behaviour of the edit drawer.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withBus } from 'react-suber'

export class EditorInfo extends Component {
  render () {
    return <div>Editor</div>
  }
}

export default withBus(connect()(EditorInfo))
