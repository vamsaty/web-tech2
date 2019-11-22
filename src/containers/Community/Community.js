import React, { Component } from 'react';
import classes from './Community.module.css';
import ComPost from '../ComPost/ComPost';
import {Divider,Paper,Box, Button, Fab} from '@material-ui/core';
import { CircularProgress,FormControlLabel,Fade } from '@material-ui/core';
import { Cancel, Pages, PostAdd } from '@material-ui/icons'
import {NavLink,Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
// import prof from '../../img/avatar1.jpg'
import * as actions from '../../store/actions/index';
import Axios from 'axios';
import Post from '../Post/Post';
import abo from '../../img/Abortion.jpg'
import air from '../../img/Air.jpg'
import add from '../../img/Addison.jpg'

class Community extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            feeds : [],
            posts : [],
            showPost : false,
            activePost : 0,
            about : [
                'Hello I\'m a good person',
                '@something.com',
                'asdf',
                'asfasfwer23',
            ],
            msg : '',
            imageList : [
                {title:'Abortion',data : abo},
                {title:'Air',data : air},
                {title:'Addison',data : add}
            ]
        }
    }

    getPersonalFeed=(url)=>{
        // console.log(url)
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){

                if(xhr.status === 200){
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

                    console.log('[FEEWEWE] : ', data)
                }

            }
        }.bind(this)

        xhr.open('GET',url,true)
        this.setState({
            loading : true
        })
        xhr.send()

    };

    componentDidMount(){
        if(!this.props.isAuthenticated){
            this.props.onTryAutoSignup()
        }
        this.getPersonalFeed('http://localhost:5000/api/v1/personalFeeds/'+String(this.props.username));
        if(this.props.isAuthenticated){
        }
    }


    getPosts = (id) =>{
        this.setState({
            activePost : id
        })
        let xhr = null;
        let url = null;
      
        url = 'http://localhost:5000/api/v1/posts/'+id
        
        xhr = new XMLHttpRequest();
        const tempData = null;

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                this.setState({
                    posts : JSON.parse(xhr.responseText).data
                });
            }else{
                this.setState({
                    posts : []
                })
            }
        }.bind(this);
        
        xhr.open("GET", url, true);
        xhr.send()

    }

    handlePost = () =>{
        console.log('HANDLING .... POST')
        this.setState({showPost : false});
        this.getPosts(this.state.activePost)
    }

    togglePost = () =>{
        this.setState({showPost : !this.state.showPost})
    }
    
    render(){

        const topFeeds = (this.state.feeds.length) ? this.state.feeds.slice(0,3) : []

        const communityDetails = (
            <div className={classes.infoPaper}>
                <div className={classes.userDetails}>
                    <h5>
                        {this.props.username}
                    </h5>
                    <img style={{width:'100px'}}/>
                    <br/>
                    <div>
                        {/* <p> she is a good person </p> */}
                    </div>
                </div>

                <div className={classes.userFeats}>
                    <ul style={{listStyle:'none'}}>
                        {this.state.about.map((val,ind)=>{
                            return(
                                <li>{val}</li>
                            );
                        })}
                    </ul>
                </div>


                {
                    this.state.imageList.map((val,ind)=>(
                        <div className={classes.boxDetails} key={ind}>
                            <ul>
                            <li className={'l3'} style={{color:'black',backgroundImage: `url(${val.data})`}}>
                                    <p>{val.title}</p>
                                </li>
                            </ul>
                        </div>
                        )
                    )
                }


            </div>
        )

        
        let posts = null;

        if(this.state.posts.length){
            posts = (
                <>
                {this.state.posts.map((val,ind)=>{
                    return (
                        <ComPost 
                            data = {val.data}
                            time = {val.time}
                            author = {val.by}
                        />
                    );
                })}
                </>
            )
        }else{
            posts = <h3 style={{color:"red"}}>
                NO POSTS TO SHOW
            </h3>
        }
        

        let naviGate = null;
        if(this.state.feeds){
            naviGate = (
                <nav>
                    <ul className={classes.navItems}>

                        {   
                            this.state.feeds.map((val,ind)=>{
                                let cnt = 0;
                                return (
                                    <li key={ind}>
                                        
                                        <NavLink 
                                            activeStyle={{color : 'white'}} 
                                            // className = {classes.link}
                                            onClick = {()=>this.getPosts(val.communityID)} 
                                            style={{textDecoration:'none'}} 
                                            to={this.props.match.url + '/' + val.name}>

                                            <Button variant = 'conatined' color="primary" fontFamily="fontFamily" fontWeight="fontWeightLight" m={1}>
                                                {val.name}
                                            </Button>

                                        </NavLink>

                                    </li>            
                                )
                                cnt += 1;
                            })
                        }

                    </ul>
                </nav>
            );
        }

        let postVal = null;
        let postIcon = <PostAdd />

        if(this.state.showPost){
            postVal = <Post activePost = {this.state.activePost} 
            clicked={this.handlePost} />
            postIcon = <Cancel />
        }
        postIcon = <Fab  onClick={this.togglePost} checked={this.state.showPost}>
                        {postIcon}
                    </Fab>

        return (
            <div className={"mainContent"}>
                <div className={"topContent"}>
                  <h4></h4>
                  <h1>
                    COMMUNITY
                  </h1>
                </div>
                <Divider/>
                
                {communityDetails}

                <Divider/>
                <Divider/>

                {naviGate}

                <Divider />
                <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div className={classes.postComponent}>
                        {posts}
                    </div>
                    {/* <div> */}
                    {postVal}
                    {postIcon}
                    {/* </div> */}
                </div>
                
            </div>
            
        );
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
      onTryAutoSignup: () => dispatch( actions.authCheckState() )
    };
  };
  
  export default withRouter( connect( mapStateToProps, mapDispatchToProps )( Community ) );
  