// Component for Flight data
"use strict"

import React from 'react'
import ReactDOM from 'react-dom'
import getd3LivePriceGraph from './flightDataGraphFetch'


class FlightData extends React.Component {
	render() {
		return (
			<div className={this.props.className}></div>
		)
	}
  componentDidMount(){
    getd3LivePriceGraph();
  }
}

export default FlightData;