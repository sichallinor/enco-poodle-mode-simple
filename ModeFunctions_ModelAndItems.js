

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

        var newItem = this.modeParseIncomingModel(mode,template)
        newItem['_dirty'] = true;
        newItem['_deleted'] = false;

        // -------------------------------------------
        // INSERT THE TEMPLATE ITEM IN THE APPROPRIATE LIST
        // empty the models 
        var autoAddToModels = true;
        if(autoAddToModels){
            this.modeSetModel(mode,newItem)
            console.log("modeCreateNew : adding to models (in ref)",mode.reference);
        }
        if(autoAddToItems) {
            this.modeAddItem(mode,newItem)
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
        //if(!mode.hasOwnProperty('items')){
            mode['items'] = [];
        //}else{
        //    mode.items.length = 0; // TO EMPTY THE ARRAY
        //}
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
        }else{
            // HERE IM EXPECTING A SINGLE ITEM
            var singleItem = items;
            // ------------------------------------------------------
            // IF WE HAVE A SCHEMA WE MAY PARSE THE INCOMING MODEL 
            if(schema){
                var newItem = this.parseIncomingModel(schema,singleItem);
                mode.items.push(newItem);  
            }else{
                mode.items.push(singleItem);  
            }
        }
    },

    modeParseIncomingModel(mode,model){
    	var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;
        var newItem = model;
        if(schema) newItem = this.parseIncomingModel(schema,model);
        return newItem;
    },


    // SET the first Model (results in 1 item only in the models array)
    // (REPLACES ANY EXISTING MODEL)
    modeSetModel(mode,model){
        // ADD ITEMS PROPERTY IF IT DOESNT EXIST
        if(!mode.hasOwnProperty('models')){
            mode['models'] = [];
        }else{
            mode.models.length = 0; // TO EMPTY THE ARRAY
        }
        mode.models.push(model);
    },

    // ASSIGNS DATA TO ANY EXISTING MODEL
    modeUpdateModelWithData(mode,model){
        if(mode.hasOwnProperty('models') && mode.models.length>0 ){
            var original = mode.models[0];
            Object.assign(original, model);
        }
    },

    // SET ALL MODELS ARE CLEAN (_DIRTY FLAG TO FALSE)
    modeSetModelsAreClean(mode){
        var modelsToStore = mode.models;
        for(var mIndex=0; mIndex<modelsToStore.length; mIndex++){
            var model = modelsToStore[mIndex];
            model._dirty = false;
        } 
    },

    // SET ALL BULK MODELS ARE CLEAN (_DIRTY FLAG TO FALSE)
    modeSetBulkModelsAreClean(mode){
        console.log('modeSetBulkModelsAreClean')
        if(!mode.bulk || !mode.bulk.items || !mode.bulk.items.length>0) return;
        var modelsToStore = mode.bulk.items;
        for(var mIndex=0; mIndex<modelsToStore.length; mIndex++){
            var model = modelsToStore[mIndex];
            model._dirty = false;
        } 
    },


    // EMPTY THE MODELS ARRAY
    modeEmptyModels(mode){
        if(mode['models'].length>0) {
            //mode['models'].length = 0  // THIS SHOULD BE REACTIVE
            mode['models'] = [];
        }
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


    modeBulkUpdate(mode){
        if(!mode.bulk || !mode.bulk.items || !mode.bulk.models || mode.bulk.models.length<1) return;



        var bulkModel = mode.bulk.models[0];

        console.log("modeBulkUpdate : ",bulkModel)

        for(var i=0 ; i<mode.bulk.items.length ; i++){
            var item = mode.bulk.items[i]

            // UPDATE THE ITEM
            Object.assign(item, bulkModel);
            item._dirty = true;
        }

        console.log("modeBulkUpdate_items : ",mode.bulk.items)

    },

    // ------------------------------------


    modeUpdatePagination(mode,pagination){
        console.log('modeUpdatePagination : ',pagination,mode)
        if(mode.pagination && pagination) mode.pagination = Object.assign(mode.pagination, pagination);
    },



    modeUpdateCurrentModelFromItemsByIdentityMatch(mode){
        var schema = (mode.schemas && mode.schemas.length>0) ? mode.schemas[0] : null;
        var model = (mode.models && mode.models.length>0) ? mode.models[0] : null;
        var items = (mode.items && mode.items.length>0) ? mode.items : null;

        if(model && items && schema){

            var identityField = (schema.hasOwnProperty('IdentityField')) ? schema.IdentityField : null;

            if(identityField && model.hasOwnProperty(identityField)){

                var curId = model[identityField];

                // CHECK FOR MATCH
                var filteredItems = items.filter(
                      function(item) {
                        return (item.hasOwnProperty(identityField) && item[identityField]===curId)
                      })


                if(filteredItems.length>0){
                    // A MATCH WAS FOUND
                    var newItem = filteredItems[0]
                    mode.mfSetModel(newItem);
                }

            }

        }

    },






    _parseAssignFunction: function(model){
        console.log("PARSE_ASSIGN_BASIC")
      return Object.assign(new ModeItem, model)
    },

    assignParseFunction(func){
        console.log("assignParseFunction")
        this._parseAssignFunction = func
    },

    parseIncomingModel(schema,model){

        // DYNAMIC PARSE ASSIGN FUNCTION .. CAN BE OVERRIDEN BY MODULES AT HIGHER LEVELS
        if(this._parseAssignFunction) {
            model = this._parseAssignFunction(model)
        }

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