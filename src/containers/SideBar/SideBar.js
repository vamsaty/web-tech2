import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import {withRouter, NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import classes from './SideBar.module.css';
import {Paper, Button} from '@material-ui/core';
import axios from 'axios';

class SideBar extends Component{

    constructor(props){
      super(props);
      this.state = {
        activeElement : 0,
        details : [
          {value : 'Home', to : '/'},
          {value : 'User Page', to : '/user'},
          // {value : 'General Feeds', to : '/generalFeeds'},
          {value : 'Personal Feeds', to : '/personalFeeds'},
        ]
      }
    }

    componentDidMount(){
      if(!this.props.isAuthenticated)
        this.props.onTryAutoSignup()
    }

    handlePageChange = (ind)=>{
      this.setState({
        activeElement : ind
      })
    }

    recommend = () =>{
      const url = 'http://localhost:5000/user_actions'
      axios.get(url)
    }

    render(){

      let classList = [classes.sideBar]
      if(this.props.show){
        classList.push(classes.Show)
      }else{
        classList.push(classes.Hide)
      }
      // console.log('[CLICKED] : ')
      return(
        <div className={classes.container}>
          <h3 style={{color:'white'}}>MENU</h3>
          <ul className={classes.sideBar}>
            {
              this.state.details.map((val,ind)=>{
                let nameClass = ''
                if(this.state.activeElement === ind){
                  nameClass = classes.active
                }
                if(val.to !== '/'){
                  return (
                    <li key={ind}>
                      <NavLink className={classes.linkers} activeStyle={{ backgroundColor:'tomato',color : 'white' }} to={val.to}>
                        {val.value}
                      </NavLink>
                    </li>
                  );
                }else{
                  return (
                    <li key={ind}>
                      <NavLink className={classes.linkers} activeStyle={{ backgroundColor:'tomato',color : 'white' }} exact to={val.to}>
                        {val.value}
                      </NavLink>
                    </li>
                  );
                }

              })
            }

          </ul>
        </div>
      );
    
    }
}



const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.token !== null
    };
};
  
const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch( actions.authCheckState() )
    };
};
  

  
export default withRouter( connect( mapStateToProps, mapDispatchToProps )( SideBar) );
  