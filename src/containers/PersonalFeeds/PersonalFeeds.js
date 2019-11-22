import React, { Component } from 'react';
import { CircularProgress,Paper, Divider } from '@material-ui/core';
import classes from '../HomePage/HomePage.module.css';
import axios from 'axios';
import {Switch,Route,Redirect} from 'react-router-dom';
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'

class PersonalFeeds extends Component{
    
    constructor(){
        super();
        this.state = {
            feeds : []
        }
    }

    componentDidMount(){

        if(!this.props.isAuthenticated){
            this.props.onTryAutoSignup()
        }
        
        window.addEventListener('scroll', this.handleScroll, true);
        let url = ''
        url = 'http://localhost:5000/api/v1/personalFeeds/'+String(localStorage.getItem('name'))
        axios.post('http://localhost:5000/api/v1/clearScroll',{}).then(response=>{
            this.getPersonalFeed(url);
        })
    }

    getPersonalFeed=(url)=>{
        console.log(url)
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){

                let feedData = [...this.state.feeds]
                const data = JSON.parse(xhr.responseText)
                const len = data.length

                for(let i=0;i<len;i++){
                    feedData.push(data[i])
                }

                this.setState({
                    feeds : feedData,
                    loading : false
                })

                console.log('[FEEWEWE] : ', this.state.feeds)

            }
        }.bind(this)

        xhr.open('GET',url,true)
        this.setState({
            loading : true
        })
        xhr.send()

    };

    handleScroll = e => {
        let url = ''
        url = 'http://localhost:5000/api/v1/personalFeeds/'
        let element = e.target
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            this.getPersonalFeed(url)
        }    
    }
    

    render(){

        let personalContent = null;

        if(this.state.feeds.length){
            personalContent = this.state.feeds.map((val,ind)=>{
                return(
                    <div key={ind} className={classes.unitCard}>
                        <div>{val.name}</div>
                        <div>{val.communityID}</div>
                    </div>
                )
            })
            personalContent = (  
                <div className={classes.feedList} onScroll={this.handleScroll}>
                    <h3>PERSONAL FEEDS</h3>
                    <div className={classes.container}>{personalContent}</div>
                </div>
            )
        }

        return(
            <div className={classes.feedContainer}>
                {personalContent}
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
      onTryAutoSignup: () => dispatch( actions.authCheckState() ),
      // onLogout
    };
  };
  
  export default ( connect( mapStateToProps, mapDispatchToProps )( PersonalFeeds ) );