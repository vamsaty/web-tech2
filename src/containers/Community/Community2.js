import React, { Component } from 'react';
// import classes from './Community.module.css';
import ComPost from '../ComPost/ComPost';


const comm = (props) => {
    
    const posts = (
        <>
            {[0,1,2,3,4,5,6,7,8,9,10].map((val,ind)=>{
                return (
                    <ComPost>
                        {/* <h4>asfaisudof</h4>     */}
                    </ComPost>
                );
            })}
        </>
    )

    return posts;

}


export default comm;