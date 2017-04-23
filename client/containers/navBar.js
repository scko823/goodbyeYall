'use strict'

import React from 'react';
import { Link } from 'react-router';
import { Button, Glyphicon, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AirportDropdown from './airportDropdown';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IS_LOGGED_IN, changeLogin } from '../actions/isLoggedIn';


//renders navBar component

class NavBar extends React.Component{
  constructor(props){
    super(props);
    let lastDismissed = localStorage.getItem('lastDismissed') || 0;
    this.state = {
      showDismiss: (new Date().getTime() - lastDismissed) > (60*1000)
    }
  }

  componentWillMount(){
    localStorage.setItem('originairport', (localStorage.getItem('originairport')|| "AUS-sky"));
    this.profilePhoto = (localStorage.getItem('goodbyeyall.profile_photo'));
    this.timer = setInterval(()=>{
      let lastDismissed = localStorage.getItem('lastDismissed') || 0;
      this.setState({
        showDismiss: (new Date().getTime() - lastDismissed) > (60*1000)
      })
    },60*1000)
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  logout(){
    localStorage.removeItem('goodbyeyall.fb_id');
    this.props.changeLogin(false);
    window.location.assign('/');
  }

  dismiss(){
    localStorage.setItem('lastDismissed', new Date().getTime())
    this.setState({showDismiss:false})
  }

  render(){
    let redirect_uri = process.env.NODE_ENV==="production" ? 'http://www.goodbyeyall.com/Preferences' : 'http://localhost:4000/Preferences';
    let facebookAuthUrl = `http://www.facebook.com/dialog/oauth?client_id=1071311906250508&scope=email&response_type=token&redirect_uri=${redirect_uri}`;
    return (
    <div className="container">
      <div>we are no longer working on this</div>
      <Navbar className="navbar-fixed-top">
        <Navbar.Header>
          <Navbar.Brand className="logo">
            <LinkContainer to={{pathname:'/'}}><div><img src='/assets/images/logo.png'/><div className="logo-text">GoodbyeYall</div></div></LinkContainer>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <LinkContainer className="navbar-button" to={{pathname:'/HowItWorks'}}><NavItem eventKey={2} href="#">How it Works</NavItem></LinkContainer>
          <LinkContainer className="navbar-button" to={{pathname:'/MeetTheDevs'}}><NavItem eventKey={3} href="#">Meet the Devs</NavItem></LinkContainer>
          <NavDropdown className="navbar-button" eventKey={3} title="Travel Themes" id="basic-nav-dropdown">
            <LinkContainer to={{pathname:'/Package/American Cities'}} className="navbar-button"><MenuItem eventKey={3.1}><div>American Cities</div></MenuItem></LinkContainer>
            <LinkContainer to={{pathname:'/Package/Foodie Cities'}} className="navbar-button"><MenuItem eventKey={3.2}><div>Foodie Cities</div></MenuItem></LinkContainer>
            <LinkContainer to={{pathname:'/Package/Global Explorer'}} className="navbar-button"><MenuItem eventKey={3.3}><div>Global Explorer</div></MenuItem></LinkContainer>
            <LinkContainer to={{pathname:'/Package/Party Islands'}} className="navbar-button"><MenuItem eventKey={3.4}><div>Party Islands</div></MenuItem></LinkContainer>
            <LinkContainer to={{pathname:'/Package/Seven Wonders'}} className="navbar-button"><MenuItem eventKey={3.5}><div>Seven Wonders</div></MenuItem></LinkContainer>
            <LinkContainer to={{pathname:'/Package/Seven Natural Wonders'}} className="navbar-button"><MenuItem eventKey={3.6}><div>Seven Natural Wonders</div></MenuItem></LinkContainer>
          </NavDropdown>
          <AirportDropdown / >
          {
            this.props.isLoggedIn ?
              <NavDropdown className="navbar-button" eventKey={4} href="#" id="basic-nav-dropdown" title={<img className='avatar' src={this.profilePhoto}></img>}>
                <MenuItem eventKey={4.1}><LinkContainer to={{pathname:'/Preferences'}} className="navbar-button"><div>Preferences</div></LinkContainer></MenuItem>
                <MenuItem eventKey={4.2} className="logout-button"><LinkContainer to={{pathname:'/Preferences'}} className="navbar-button" ><div onClick={this.logout.bind(this)}>Logout</div></LinkContainer></MenuItem>
              </NavDropdown>:null
          }
         { !this.props.isLoggedIn ? <a href={facebookAuthUrl}><img className="fb-login-button" src="/assets/images/facebookLoginBtn.png" /></a> : null}
        </Nav>
      </Navbar>
      {
        this.state.showDismiss ?
          <div className="seven-view pull-right goodbye">
          The Traveling Codesmen are no longer maintaining or updating the site. Thank you for your interest.
          <Button bsSize="xsmall" onClick={this.dismiss.bind(this)}><Glyphicon glyph="remove" /></Button>
          </div> : null
      }
      {this.props.children}
    </div>

  )};
};

function mapStateToProps ( state ){
  return {
    isLoggedIn: state.isLoggedIn.isLoggedIn
  }
}

function mapDispatchToProps( dispatch ){
  return bindActionCreators({ changeLogin: changeLogin }, dispatch)
}

// 'export' is for enzyme testing, 'export default' is for regular react functionality
export { NavBar, MenuItem, NavDropdown, AirportDropdown }

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
