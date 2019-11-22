import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import classes from './TopBar.module.css'
import {NavLink} from 'react-router-dom'
import { HomeOutlined, CloseOutlined } from '@material-ui/icons'
import {withRouter} from 'react-router-dom';
import axios from 'axios';
import {connect} from 'react-redux';
import { CircularProgress } from '@material-ui/core';

class TopBar extends Component{

    constructor(){
      super();
      this.state = {
        activeElement : 0,
        search : '',
        show : false,
        recData : [],
        notLoggedIn : [
          {value : 'Login', to : '/login'},
          {value : 'Register', to : '/register'}
        ],
        loggedIn : [
          {value : 'Notification',to : '/user'},
          {value : 'Messages',to : '/user'},
          {value : 'Todo',to : '/user'},
          // {value : 'Logout', to : '/logout'}
        ]
      }
    }

    submissionThrottle = (e) =>{
      this.setState({
        search : e.target.value,
        show : true
      })
      console.log('[STATE] : ',this.state)
      if(this.state.search.length < 3)
        return 0;

      

      var xhr = new XMLHttpRequest()
      console.log('here there werw')
      let url = 'http://localhost:5000/api/v1/submission/' + encodeURIComponent(this.state.search.trim())
      console.log(url)
      xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
          
          this.setState({
            recData : JSON.parse(xhr.responseText)
          })
          console.log(this.state.recData)

        }
      }.bind(this)

      xhr.open('GET',url,true)
      xhr.send()

    }

    componentDidMount(){
      if(!this.props.isAuthenticated)
        this.props.onTryAutoSignup()
    }

    hide = () =>{
      console.log('here were')
    }

    subscribe = (id) =>{
      this.setState({show:false})
      console.log('[SUBSCRIBE] : ', id)

      const url = 'http://localhost:5000/api/v1/subscribe'
      axios.post(url,{
        'username' : this.props.username,
        'id' : id
      }).then(response=>{

      })

    }

    hit = () =>{
      console.log('kill')
    }

    render(){

      let classList = [classes.container]
      if(this.props.isAuthenticated){
        classList.push('container')
      }

      let list = null;

      if(this.props.isAuthenticated){
        list = 
            this.state.loggedIn.map((val,ind)=>{
                return(
                  <li key={ind}>
                    <NavLink 
                    activeStyle={{ color : 'white' }}
                    className={classes.linkers}
                      exact to={val.to}>
                      {val.value}
                    </NavLink>
                  </li>
                )
            })
      }else{
        list = 
          this.state.notLoggedIn.map((val,ind)=>{
            return(
              <li key={ind}>
                <NavLink 
                activeStyle={{ color : 'white' }}
                className={classes.linkers} 
                  exact to={val.to}>
                  {val.value}
                </NavLink>
              </li>
            )
          })
        
      }


      let recommender = null;
      if(this.state.show && this.state.recData.length){
        recommender = (

          <div className={classes.recDiv} 
            onMouseOver={()=>this.setState({show : true})}>

            <ul className={classes.throttleList}>
              {this.state.recData.map((val,ind)=>{
                return(
                  <li key={ind}
                  onClick={( ) => {this.subscribe(val.communityID)}}> 
                    {val.name} 
                  </li>
                );

              })}
            </ul>

          </div>

        );
      }else if(this.state.show){
        recommender = (
          <div className={classes.recDiv}>
            <p> enter your desired community </p>
          </div>
        )
      }

      return(
        <div className={classes.container}>
        <span onClick={this.props.toggleSideBar}><HomeOutlined /></span>
        <input 
          style={{marginLeft:'100px'}}
          className={classes.searchInput} placeholder="search"
          onChange={(e) => this.submissionThrottle(e)}
          onFocus = { ()=>{this.setState({show : true}) } }
          type="text" value={this.state.search} />
          
          {(this.state.show) ? <span onClick={()=>this.setState({show : false})} style={{position:'relative',right:'30px'}}><CloseOutlined /></span> : null}

          {recommender}
          <ul className={classes.topBar}>
            {list}
            {((this.props.isAuthenticated) ? <li onClick={this.props.onTryLogout} className={classes.linkers}> Logout </li> : null)}

          </ul>
        </div>
      )
      
    }
}



const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.token !== null,
      username : state.auth.name
    };
};
  
const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch( actions.authCheckState() ),
        onTryLogout : () => dispatch( actions.logout() )
    };
};
  

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( TopBar ) );