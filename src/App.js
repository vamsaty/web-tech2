import React, { Component } from 'react';
import {withRouter, Redirect,Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
import TopBar from './containers/TopBar/TopBar';
import './App.css';
import SideBar from './containers/SideBar/SideBar';
import HomePage from './containers/HomePage/HomePage';
import Login from './containers/Login/Login';
import UserPage from './containers/UserPage/UserPage';
import Register from './containers/Register/Register';
import GeneralFeeds from './containers/GeneralFeeds/GeneralFeeds';
import PersonalFeeds from './containers/PersonalFeeds/PersonalFeeds';

class App extends Component{

  constructor(){
    super();
    this.state = {
      showSideBar : true
    }
  }

  componentDidMount(){
    if(!this.props.isAuthenticated)
      this.props.onTryAutoSignup()
  }

  render(){

    let mainBody = (
      <Switch>
        
        
        <Route exact path='/login' component = {Login} />
        <Route exact path='/register' component = {Register} />
        <Route exact path='/generalFeeds' component = {GeneralFeeds} />
        <Route exact path='/personalFeeds' component = {PersonalFeeds} />
        <Route exact path='/logout' render = {()=>{
            return (<Redirect to='/' />)
          }} />
        
        <Route path="/user" component={UserPage} />
        <Route exact path="/" component={HomePage} />

      </Switch>
  );


    return (
      <div className="App">
        <header className="App-header">
          
          <TopBar toggleSideBar = {()=>{
            this.setState({showSideBar : !this.state.showSideBar})
            }}
          />
        </header>

        <div className={'main-box'}>
          
          <SideBar show={this.state.showSideBar} />
          <main className={'content-box'}>
            
            {mainBody}

          </main>

        </div>
      </div>
    )
  ;}
}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() ),
    // onLogout
  };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
