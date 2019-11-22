import React from 'react';
import classes from 'Box.module.css';

const box = (props) =>{

    const style = {
        display : (props.display)?props.display : 'flex',
        width : (props.width)?props.width:'200px',
        height : (props.height)?props.height:'200px',
        border : (props.border) ? props.border : '1px solid gray',
        flexDirection : (props.dir)?props.dir : 'none'
    }

    return (
        <div className={classes.box}>
            {props.children}
        </div>
    );
}

export default box;