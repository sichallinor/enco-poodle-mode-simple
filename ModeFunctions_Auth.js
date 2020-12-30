'use strict';


export default {
    
    // NOTE THAT THESE "MODE FUNCTIONS" CAN BE IMPORTED EASILY INTO ANY PROJECT WITHOUT THE OVERHEAD OF THE FULL MODE CLASS
    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    // These functions accept a mode object (albeit NO EXPECTATIONS other than a JS object) ...
    // Any ASSUMPTIONS about mode are checked and should not be REQUIRED
    // plus accept any other input ...
    // then manipulate the mode in order to produce the finished mode



    modeAddAuthToken(mode,token){
        if(!mode.hasOwnProperty('auth')) mode['auth'] = {};
        mode.auth['token'] = token;

        mode.auth['is_signed_in'] = true;
    },
    modeStripAuthToken(mode){
        console.log("modeStripAuthToken",mode)
        if(mode.hasOwnProperty('auth')){
            // REMOVE TOKEN DETAILS
            if(mode.auth.hasOwnProperty('token')) mode.auth['token'] = null;
            if(mode.auth.hasOwnProperty('is_signed_in')) mode.auth['is_signed_in'] = false;
            if(mode.auth.hasOwnProperty('current_role')) mode.auth['current_role'] = null;
            if(mode.auth.hasOwnProperty('user')) mode.auth['user'] = null;
        } 
    },
    //----------------
    modeStripLoginDetails(mode){
        if(mode.hasOwnProperty('auth')){
            // REMOVE LOGIN DETAILS
            //if(mode.auth.hasOwnProperty('email')) delete mode.auth.email;
            //if(mode.auth.hasOwnProperty('password')) delete mode.auth.password;
            //if(mode.auth.hasOwnProperty('email')) mode.auth.email=null;
            if(mode.auth.hasOwnProperty('password')) mode.auth.password=null;

        }
    },
    //----------------
    modeAddAuthUserData(mode,data){
        if(!mode.hasOwnProperty('auth')) mode['auth'] = {};
        Object.assign(mode.auth,data)
    },

    //----------------
    modeAddAuthSignInMethod(mode,method){
        if(!mode.hasOwnProperty('auth')) mode['auth'] = {};
        //eg method = "is_signed_in_email"
        mode.auth[method] = true
    },
    modeStripAuthSignInMethod(mode,method){
        if(mode.hasOwnProperty('auth')){
            //eg method = "is_signed_in_email"
            mode.auth[method] = false
        }
    }

}