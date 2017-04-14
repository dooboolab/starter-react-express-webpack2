var axios = require('axios');

import { getSessionStorage } from '../global/functions';

const LOGIN_USER_API = "/api/auth/login";
const SIGNUP_USER_API = "/api/auth/signup";
const IS_LOGGED_API = "/api/auth/isAuthenticated";

module.exports = {
    doLogin: function(user){
        // console.log("loginApi - doLogin : " + JSON.stringify(user));
        var options = {
            method: 'POST',
            url: LOGIN_USER_API,
            data: user,
            json: true
        };
        return axios(options).then(res =>{
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data;
        }).catch(function(error) {
            throw error;
        });
    },
    doSignup: function(user){
        var options = {
            method: 'POST',
            url: SIGNUP_USER_API,
            data: user,
            json: true
        };
        return axios(options).then(res => {
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data
        }).catch(function(error){
            throw error;
        });
    },
    checkLogin: function(token){
        var options = {
            method: 'POST',
            url: IS_LOGGED_API,
            data : {
                token : token
            },
            json: true
        };
        return axios(options).then(res => {
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data;
        }).catch(function(error){
            throw error;
        });
        // return axios.get(IS_LOGGED_API).then(res => {
        //     return res.data
        // }).catch(function(error){
        //     throw error;
        // });
    }
};