import axios from 'axios';

import * as actionTypes from './actionTypes';
import { timeout } from 'q';

export const authStart = () => {
    console.log("AUTH STARTED");

    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId, name) => {
    console.log('AUTH SUCCESS')
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,// maybe userId can be here
        userId: userId,// maybe use username here
        name: name
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    console.log("LOGOUT")
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1);
    };
};

export const auth = (username, password, isSignup) => {
    return dispatch => {

        dispatch(authStart());

        const authData = {
            username: username,
            password: password,
            returnSecureToken: true
        };

        
        let url = 'http://localhost:5000/api/v1/login';

        axios.post(url, authData)
        .then(response => {
            
            const expirationDate = new Date(new Date().getTime() + 1000000)

            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("name", response.data.name);
            localStorage.setItem('expirationDate', expirationDate);

            dispatch(authSuccess(response.data.token, response.data.userId, response.data.name));

        })
        .catch(err => {
            
            if(err.response)
                dispatch(authFail(err.response.data.error));

        });

        // temp.
      }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        console.log("[TOKEN] : ",token)
        if (!token) {
            console.log("LOGOUT_HO RHA H")
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                const name = localStorage.getItem("name");
                dispatch(authSuccess(token, userId, name));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime() + 1000000) ));
            }   
        }
    };
};