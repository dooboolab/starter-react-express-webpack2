import React from 'react';
import Footer from 'Footer';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { isLoggedIn } from '../actions';
import {FaSearch} from 'react-icons/lib/fa';

class Users extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
        if(!this.props.isLoggedIn.value){
            browserHistory.replace('login');
        }
    }
    render () {
        return (
            <div>
                <div className="users">
                    users
                </div>
                <Footer/>
            </div>
        );
    }
};

const mapState = (state) => ({
    isLoggedIn: state.isLoggedIn
});
export default connect(mapState)(Users);