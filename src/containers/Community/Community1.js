import React, { Component } from 'react';
// import classes from './Community.module.css';
import ComPost from '../ComPost/ComPost';
import { CircularProgress } from '@material-ui/core';
// import Spinner from '../../components/Spinner/Spinner';

class Com1 extends Component{

    constructor(){
        super();
        this.state = {
            posts : null
        }
    }


    getPosts = (id) =>{
        
        let xhr = null;
        let url = null;
      
        url = 'http://localhost:5000/api/v1/posts/'+id
        
        xhr = new XMLHttpRequest();
        const tempData = null;

        console.log('[POST_ID] : ', id)

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
            this.setState({
                posts : JSON.parse(xhr.responseText).data
            });
            console.log(this.state.posts)
            }
        }.bind(this);
        
        xhr.open("GET", url, true);
        xhr.send()

    }

    componentDidMount(){
        if(!this.state.posts){
            this.getPosts(this.props.id)
        }
    }

    render(){

        let dis = null;
        if(this.state.posts){
            dis = (
                this.state.posts.map((val,ind)=>{
                    return (
                        <ComPost 
                            data = {val.data}
                            time = {val.time}
                            author = {val.by}
                        />
                    )
                })
            )
        }else{
            dis = <CircularProgress />
        }


        return (
            <>
                {dis}
            </>
        )
    }
}


export default Com1;