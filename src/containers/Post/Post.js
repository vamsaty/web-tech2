import React, { Component } from 'react';
import { Paper, Input, Button, Divider, TextField } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index'
import Axios from 'axios';

class Post extends Component{

    state = {
        show : false,
        msg : ''
    }

    postData=(communityID)=>{

        const msg = this.state.msg
        const author = this.props.username
        const url = 'http://localhost:5000/api/v1/post'
        
        if(!msg.length)
            return 0;

        Axios.post(url,{
            'communityID' : communityID,
            'author' : author,
            'msg' : msg
        }).then(response => {
            this.setState({
                msg : ''
            })
        })
        

    }

    render(){

        let data = <div onMouseOut={()=>this.setState({show : true})}
                        onMouseOver={()=>this.setState({show : true})} 
                        style={{width:'100%',height:'20px',backgroundColor:'red'}} >
                        here
                    </div>

        let val = (
            <>
            
            <h5>POST SOMETHING</h5>
            <Divider />
            <br></br>
                <TextField multiline type="text" onChange = {(e)=>{this.setState({ msg : e.target.value })}} value={this.state.msg} />
                <br></br>
                <div style={{display:'flex',justifyContent:'space-evenly'}}>
                    <Button variant='contained' color="primary" onClick={this.props.clicked,()=>this.postData(this.props.activePost)}>
                        Post
                    </Button>
                    <Button variant='contained' color="primary">
                        Cancel
                    </Button>
                </div>
                
            </>
        )

        if(this.state.show){
            val = null;
        }

        return(
            <Paper style={{display:'flex',
                flexDirection:'column',
                padding:'10px',
                width:'25%',
                margin:'20px 20px 0 20px'}}>
                {/* {data} */}
                {val}

            </Paper>
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
  
  export default withRouter( connect( mapStateToProps, mapDispatchToProps )( Post ) );
  