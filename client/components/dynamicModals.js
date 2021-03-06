'use strict'

import React from 'react';
import {Popover, Modal, OverlayTrigger, Button, } from 'react-bootstrap';

//============================Instructions===============================
//Button Label
//{this.props.bTitle}

//Modal Title
//{this.props.modalTitle}

//Header
//{this.props.item}

//introToPopover
//{this.props.introToPopover}

//Popover title
//{this.props.popOverTitle}

//Popover first paragraph
//{this.props.PopoverPOne}

//Popover second paragraph
//{this.props.PopoverPTwo}

// Modal Header Top Section
//{this.props.modalHeaderOne}

//Body text of the top
//{this.props.topBody}
//or
//{this.props.children}

//Modal Header Bottom
//{this.props.modalHeaderTwo}

//Body Text
//{this.props.bodyText}

//Personal Statement
//{this.props.personalStatement}

//modal used for meet the devs bio and country info
const DynamicModal = React.createClass({

  getInitialState() {
    return { showModal: false };
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

	render() {

	  let popover = <Popover title={this.props.popOverTitle}>
	  								<p>{this.props.PopoverPOne}</p>
	  								<p>{this.props.PopoverPTwo}</p>
	  							</Popover>;

	  return (
	    <div>
				<Button className='country-info-button' bsStyle={this.props.bsStyle} onClick={this.open}>
					{this.props.bTitle}
				</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
        	<Modal.Header closeButton>
	        	<Modal.Title className='modal-header'>{this.props.item}</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
	          <h4>{this.props.modalTitle}</h4>
	          <p>{this.props.personalStatement}</p>
	          <h4>{this.props.modalHeaderOne}</h4>
	          <p>{this.props.topBody}
	          <p>{this.props.children}</p>
	          	<OverlayTrigger overlay={popover}>
	          		<a href="#">{ " " + this.props.popoverLink}</a>
	          	</OverlayTrigger>
          	</p>
	          <hr />
	          <h4>{this.props.modalHeaderTwo}</h4>
	          <p>{this.props.bodyText}</p>
	        </Modal.Body>	
	        <Modal.Footer>
	          <Button onClick={this.close}>Close</Button>
	        </Modal.Footer>
	      </Modal>
	    </div>
	  );

	}
})

// 'export' is for enzyme testing, 'export default' is for regular react functionality
export { DynamicModal	}

export default DynamicModal