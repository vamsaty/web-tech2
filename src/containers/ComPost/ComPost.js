import React from 'react';
import classes from './ComPost.module.css';
import { Paper, Divider } from '@material-ui/core';


class PostCard extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
    
    render(){

        // console.log('m')
        return(
            <Paper className={classes.postCard} elevation={16} square>
                <div>
                    <img />
                    <span className={classes.mainSpan}>
                        <span className={classes.detSpan}>author : </span> 
                        <span  className={classes.detVal}>{this.props.author}</span>
                        <Divider />
                        <span className={classes.detSpan}>time : </span>   
                        <span className={classes.detVal}>{this.props.time}</span>
                    </span>
                </div>
                <Divider/>
                <div>
                    <p>
                        {this.props.data}
                    </p>
                </div>
            </Paper>
        );
    }
}

export default PostCard;