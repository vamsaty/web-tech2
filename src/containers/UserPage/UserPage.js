import React, { Component } from 'react';
import classes from './UserPage.module.css';
import { CircularProgress } from '@material-ui/core';
import {connect} from 'react-redux'
import {Redirect,withRouter} from 'react-router-dom'
import * as actions from '../../store/actions/index'
import Community from '../Community/Community';


class UserPage extends Component{


    constructor(props){
        super(props);
        this.state = {
            bioImg : [],
            bioDetails  : [],
            rightSide : [],
            loading : {
                bioImg : true,
                bioDetails : true,
                rightSide : true
            },
            
        }
    }

    getBioDetails = () =>{
        let xhr = new XMLHttpRequest()
        let url = 'http://localhost:5000/api/v1/bio/' + String(localStorage.getItem('userData'))
        let oldLoad = this.state.loading
        oldLoad.getBioDetails = true
        this.setState({
            loading : oldLoad
        })
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                let oldState = this.state.loading
                oldState.bioDetails = false
                this.setState({
                    bioDetails : JSON.parse(xhr.responseText),
                    loading : oldState
                })
            }
        }.bind(this)

        xhr.open('GET',url,true)
        xhr.send()
    }

    getBioImg = () =>{
        let xhr = new XMLHttpRequest()
        let url = 'http://localhost:5000/api/v1/bioImg/' + String(localStorage.getItem('userData'))
        let oldLoad = this.state.loading
        oldLoad.getBioImg = true
        this.setState({
            loading : oldLoad
        })
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                let oldState = this.state.loading
                oldState.bioImg = false
                this.setState({
                    bioImg : JSON.parse(xhr.responseText),
                    loading : oldState
                })
                
            }
        }.bind(this)

        xhr.open('GET',url,true)
        xhr.send()
    }

    getRightSide = () =>{
        let xhr = new XMLHttpRequest()
        let url = 'http://localhost:5000/api/v1/bioRight/' + String(localStorage.getItem('userData'))
        let oldLoad = this.state.loading
        oldLoad.getBioImg = true
        this.setState({
            loading : oldLoad
        })
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                let oldState = this.state.loading
                oldState.rightSide = false
                this.setState({
                    rightSide : JSON.parse(xhr.responseText),
                    loading : oldState
                })
            }
        }.bind(this)

        xhr.open('GET',url,true)
        xhr.send()
    }

    componentDidMount(){
        // console.log('[PROPS] : ', this.props.isAuthenticated)
        // this.getBioDetails()
        // this.getBioImg()
        // this.getRightSide()
    }

    render(){
        
        if(!this.props.isAuthenticated){
            return <Redirect to='/' />
        }

        let bioDetails = <CircularProgress />
        let bioImg = <CircularProgress />
        let rightSide = <CircularProgress />
        if(!this.state.loading.bioDetails){
            bioDetails = this.state.bioDetails.map((val,ind)=>{
                return(
                    <li key={ind}> {val} </li>
                )
            })
        }
        if(!this.state.loading.bioImg){
            bioImg = this.state.bioImg.map((val,ind)=>{
                return (
                    <li key={ind}> {val} </li>
                )
            })
        }
        if(!this.state.loading.rightSide){
            rightSide = this.state.rightSide.map((val,ind)=>{
                return(
                    <li key={ind}> {val} </li>
                )
            })
        }

        let detailsPage = (
            <div className={classes.infoContainer}>
                <div className={classes.bioImg}>
                    {bioImg}
                </div>
                
                <div className={classes.bioDetails}>
                    {bioDetails}
                </div>

                <div className={classes.rightSide}>
                    {rightSide}
                </div>
            </div>
        )
        
        let navList = null
        navList = (
           <p>asd</p>
        )

        return(
            <div className={classes.root}>
                <div className={classes.communityPage}>
                    <Community />
                </div>
            </div>
        )
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
  
  export default withRouter( connect( mapStateToProps, mapDispatchToProps )( UserPage ) );
  