import React, { Component } from 'react';
import { CircularProgress,Paper, Divider, createGenerateClassName } from '@material-ui/core';
import classes from './HomePage.module.css';
import axios from 'axios';
import {Switch,Route,withRouter} from 'react-router-dom';
import GeneralFeeds from '../GeneralFeeds/GeneralFeeds';
import {connect} from 'react-redux'
import PersonalFeeds from '../PersonalFeeds/PersonalFeeds';
import * as actions from '../../store/actions/index';
// import ReactRotatingText from './Type/ReactRotatingText'
import Typist from 'react-typist';

let lastScrollY = 0;
let ticking = false;


class HomePage extends Component{


    constructor(props){
        super(props);
        this.state = {
            loading : true,
            recommended : []
        };
        
    }

   

    getReco = () =>{
        console.log('[GETTING RECOMMENDATION]')

        const url = 'http://localhost:5000/api/v1/personalFeeds/'+String(localStorage.getItem('name'))

        axios.get(url).then(resp =>{
            const url = 'http://localhost:5000/user_recommendations/' + String(localStorage.getItem('userId'))
            
            const comList = []
            resp.data.map((val,ind)=>{
                comList.push(val.communityID)
            })
            
            axios.post(url,{ 'community_list' : comList })
            .then(response => {

                this.setState({
                    recommended : response.data.result
                })
                console.log('[RECOMMENDATIONS] : ', this.state.recommended)

            })
            

        })
        
    }
  
    componentDidMount(){
        if(!this.props.isAuthenticated){
            this.props.onTryAutoSignup();
        }
        this.getReco()

        window.addEventListener('scroll', this.handleScroll, true);
        let url = ''
        url = 'http://localhost:5000/api/v1/generalFeeds/'
        axios.post('http://localhost:5000/api/v1/clearScroll',{}).then(response=>{})
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render(){
       
        let content = (
            <Switch>
                <Route exact path="user/personalFeeds" component = {PersonalFeeds} />
                <Route path="/" component = {GeneralFeeds} />
            </Switch>
        )

        let recContent = <CircularProgress />
        if(this.state.recommended.length){
            recContent = this.state.recommended.map((val,ind)=>{
                return(
                    <div key={ind} className={classes.unitCard}>
                        <div>{val.name}</div>
                        <div>{val.communityID}</div>
                    </div>
                )
            })
        }


        return(
            <div className={classes.root}>
                <h1 style={{backgroundColor:'white'}}>
                    <span style={{color:'skyblue'}} >HEALTH</span>
                    <span style={{color:'tomato'}}>CHAIN</span>
                </h1>
                <div className={classes.recFeedList}>
                        {(this.props.isAuthenticated) ? 
                            (<>
                                <h3>RECOMMENDED</h3>
                                <div className={classes.container}>
                                    {recContent}
                                </div>
                            </>
                            ): 
                            <h1 style={{color:'rebeccapurple'}}>
                                <Typist>
                                    PLEASE LOGIN TO SUBSCRIBE TO A COMMUNITY
                                </Typist>
                            </h1>
                        }
                    </div>
                    {content}
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
  
  export default withRouter( connect( mapStateToProps, mapDispatchToProps )( HomePage ) );
  