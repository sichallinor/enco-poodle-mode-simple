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
    },
    modeStripLoginDetails(mode){
        if(mode.hasOwnProperty('auth')){
            // REMOVE LOGIN DETAILS
            if(mode.auth.hasOwnProperty('email')) delete mode.auth.email;
            if(mode.auth.hasOwnProperty('password')) delete mode.auth.password;
        }
    },



}