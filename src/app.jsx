import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import reducers from './reducers';

import Main from 'Main';
import Users from 'Users';
import Login from 'Login';
import Signup from 'Signup';

import { isLoggedIn } from './actions';
import { checkLogin } from './apis/authAPi';
import { getSessionStorage } from './global/functions';
import { resCode } from './global/constants';

// App css
const scss = require('./styles/app.scss');

// var Route = require('react-router').Route;
// var Router = require('react-router').Router;
// var IndexRoute = require('react-router').IndexRoute;
// var hasHistory = require('react-router').hasHistory;
// new ex6 syntax

// Add the reducer to your store on the `routing` key
const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    })
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

console.log("state : " + JSON.stringify(store.getState()));

// API통해 로그인 여부 확인
console.log("pathname :  " + window.location.pathname);
if(getSessionStorage("user")){
    checkLogin(getSessionStorage("user")).then(function(data){
        if(data.resCode == resCode.SUCCESS){
            // 로그인 됨
            if(window.location.pathname === '/login'){
                browserHistory.replace('/');
            }
            store.dispatch(isLoggedIn(true));
        } else {
            // 로그인 안됨
            browserHistory.replace('/login');
            store.dispatch(isLoggedIn(false));
        }
        console.log("reducers : " + JSON.stringify(store.getState()));
    });
}

// IndexRoute는 처음으로 보여지는 페이지다
ReactDOM.render(
    <Provider store={ store }>
      <Router history={ history }>
        <Route path="/" component={ Main }>
            <IndexRoute component={ Users }/>
            <Route path="users" component={ Users }/>
            <Route path="login" component={ Login }/>
            <Route path="signup" component={ Signup }/>
        </Route>
      </Router>
    </Provider>,
    document.getElementById('app')
);