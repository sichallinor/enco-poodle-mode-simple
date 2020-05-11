

import { default as ModeItem } from './mode_item_prototypes/ModeItem.js'

export default {

    // NOTE THAT THESE "MODE FUNCTIONS" CAN BE IMPORTED EASILY INTO ANY PROJECT WITHOUT THE OVERHEAD OF THE FULL MODE CLASS
    // ---------------------------------
    // MODE MANIPULATION FUNCTIONS
    //   MODEL AND ITEMS RELATED FUNCTIONS

    // These functions accept a mode object (albeit NO EXPECTATIONS other than a JS object) ...
    // Any ASSUMPTIONS about mode are checked and should not be REQUIRED
    // plus accept any other input ...
    // then manipulate the mode in order to produce the finished mode



    modeCreateNew(mode,template={},autoIncreaseWorkflow=true,autoAddToItems=true,autoStore=false) {
        mode.mLog("modeCreateNew");

        // ensure the template is marked as 'dirty' (being edited / not yet stored)
        template['_dirty'] = true;
        template['_deleted'] = false;

        // -------------------------------------------
        // INSERT THE TEMPLATE ITEM IN THE APPROPRIATE LIST
        // empty the models 
        var autoAddToModels = true;
        if(autoAddToModels){
            this.modeSetModel(mode,template)
            console.log("modeCreateNew : adding to models (in ref)",mode.reference);
        }
        if(autoAddToItems) {
            this.modeAddItem(mode,template)
        }
        // -------------------------------------------

        // -------------------------------------------
        // AGGREGATE AGAIN ... (if necessary)
        //if(this.mode_for_new != this.mode_master){
        //    this.mode_master.aggregateChildrensData()
        //}

        // -------------------------------------------

        //if(autoStore) { this.handleStore(); console.log("AUTOSTORE"); }

    },


    modeAddItem(mode,obj){
        console.log("mfAddItem : adding to items : (in ref)",mode.reference); 
        // -------------------------------------------
        // INSERT THE TEMPLATE ITEM IN THE APPROPRIATE LIST
        if(mode.hasOwnProperty('items')){
            if( Array.isArray(mode.items) ){
                // INSERT INTO ARRAY
                mode['items'].push(obj);
            }/*else if( typeof this.items === 'object' && this.items!==null){
                if( typeof obj === 'object' && obj!==null ){
                    // INSERT AS A PROPERTY (IF THERE IS A REFERENCE ... or use generic propname)
                    var propName = obj.hasOwnProperty('reference') ? obj.reference : 'item';
                    this.items[propName] = obj;

                    this.mfAllItems_RefreshFromObject();
                }
            }*/
        }
        // -------------------------------------------
    },

    // Add 'items' an array of items 
    modeAddItems(mode,items){
        var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;
        if(!mode.hasOwnProperty('items')){
            mode['items'] = [];
        }else{
            mode.items.length = 0; // TO EMPTY THE ARRAY
        }
        // ----------------------------------
        //we may receive an object here 
        if(Array.isArray(items)){
            // ------------------------------------------------------
            // IF WE HAVE A SCHEMA WE MAY PARSE THE INCOMING MODEL 
            if(schema){
                for(var i=0;i<items.length;i++){
                    var newItem = this.parseIncomingModel(schema,items[i]);
                    mode.items.push(newItem);  
                }
            }else{
                // expand the items in prop and add them to mode items
                mode.items.push(...items);  
            }
        }
    },

    modeParseIncomingModel(mode,model){
    	var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;
        var newItem = model;
        if(schema) newItem = this.parseIncomingModel(schema,model);
        return newItem;
    },


    // Set the first Model (results in 1 item only in the models array)
    modeSetModel(mode,model){
        // ADD ITEMS PROPERTY IF IT DOESNT EXIST
        if(!mode.hasOwnProperty('models')){
            mode['models'] = [];
        }else{
            mode.models.length = 0; // TO EMPTY THE ARRAY
        }
        mode.models.push(model);
    },

    // SET ALL MODELS ARE CLEAN (_DIRTY FLAG TO FALSE)
    modeSetModelsAreClean(mode){
        var modelsToStore = mode.models;
        for(var mIndex=0; mIndex<modelsToStore.length; mIndex++){
            var model = modelsToStore[mIndex];
            model._dirty = false;
        } 
    },


    // EMPTY THE MODELS ARRAY
    modeEmptyModels(mode){
        if(mode['models'].length>0) mode['models'].length = 0
    },

    // EMPTY THE MODELS ARRAY
    modeRemoveDeletedItems(mode){
        if(!mode.hasOwnProperty('items')) return; // exit if the mode doesnt use items
        for (var i = mode.items.length - 1; i >= 0; --i) {
            if (mode.items[i]._deleted ) {
                mode.items.splice(i,1);
            }
        }
    },


    modeSetModelMarkDeleted(mode){
        //-------------------------------
        // REMOVAL METHOD 1 - MARK FOR DELETE (ONLY)
        if(mode['models'].length>0){
            console.log("MARK DELTE")
            mode['models'][0]['_deleted'] = true;
        }
        //-------------------------------
    },

    // ------------------------------------


    parseIncomingModel(schema,model){

    	// PARSE AS PROTOTYPE
    	model = Object.assign(new ModeItem, model)

        // -----------------------------------
        // ANY FIELD THAT IS DESIGNATED AS AN OBJECT IN THE SCHEMA - BUT IS RECEIVED AS A STRING
        // WE WILL ASSUME THE STRING IS JSON AND ATTEMPT TO CONVERT THE JSON INTO AN OBJECT
        for(var propKey in schema.properties){
            var prop = schema.properties[propKey];

            if(prop.type==="object" && model.hasOwnProperty(propKey) && typeof model[propKey] === 'string') {
                if(model[propKey].length>0){
                    try{
                        model.data = JSON.parse(model.data);
                    }catch(ex){
                        model.data = {}
                    }
                }else{
                    model.data = {};
                }
            } 
        }
        //-----------------------------------
        model['_dirty'] = false;
        model['_deleted'] = false;


        model.testMessage();

        return model;
    },

    parseOutgoingModel(model){
        if(model.hasOwnProperty('data')){

            var modelStr = JSON.stringify(model);
            var cloneObject = JSON.parse(modelStr);

            // -----------------------------------
            // ANY FIELD NAMED DATA IN THE MODEL IS ASSUMED TO BE A JSON OBJECT 
            // IT SHOULD BE CONVERTED TO A STRING
            if(cloneObject.hasOwnProperty('data')) {
                cloneObject.data = JSON.stringify(cloneObject.data);
            } 
            //-----------------------------------
            return cloneObject;
        }
        return model;
    }



}