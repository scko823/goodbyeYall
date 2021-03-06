'use strict'

import React from 'react';

//renders How it works component
class MissionStatement extends React.Component {
	render() {
		return (
			<div className='mission-statement'>
			<div className='nav-spacing'></div>
				<h2>How it works</h2>
				<h4>1. Sign in using Facebook</h4>
				<h4>2. Favorite the Travel Theme of your choice</h4>
				<h4>3. Get Facebook notifications for reduced flight costs</h4>
				<h4>4. Travel!</h4>
			<div>
				<img className='how-it-works-gif' src='/assets/images/how-it-works.gif'></img>
			</div>
			</div>
		)
	}
}

// 'export' is for enzyme testing, 'export default' is for regular react functionality
export { MissionStatement };

export default MissionStatement;

