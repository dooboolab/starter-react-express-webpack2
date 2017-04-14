var axios = require('axios');

const GET_MEMBERS_URL = "/api/user/all";
const GET_MEMBER_URL = "/api/user/one/";
const UPDATE_MEMBER_URL = "/api/user/update/";

module.exports = {
    getMembers: function(){
        return axios.get(GET_MEMBERS_URL, {}).then(res => {
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data;
        }).catch(function(error) {
            console.log("getMembers : " + error);
            throw error;
        });
    },
    getMember: function(id){
        return axios.get(GET_MEMBER_URL + id, {}).then(res =>{
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data;
        }).catch(function(error){
            console.log("getMember : " + error);
            throw error;
        });
    },
    updateMember: function(member){
        var options = {
            method: 'POST',
            url: UPDATE_MEMBER_URL,
            data: member,
            json: true
        };
        return axios(options).then(res =>{
            res.data.status = res.status;
            res.data.statusText = res.statusText;
            return res.data;
        }).catch(function(error) {
            throw error;
        });
    }
};