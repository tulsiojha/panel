const databaseHandler ={
    db: null,
    init: function() {
        this.db=window.sqlitePlugin.openDatabase({
            name:'my.db',
            location:'default'
        });
        
        this.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS fielddefinition(id integer primary key, name text, type text, width integer, element_id text, element_class text, formtemplateid integer)",
            [],
            function(tx, result) {
                
            },
            function(error) {
                console.log("Error creating table fielddefinition: ",error.message);
            })
            
            tx.executeSql("CREATE TABLE IF NOT EXISTS formTemplate(id integer primary key, name text, description text, color integer)",
            [],
            function(tx, result) {
                
            },
            function(error) {
                console.log("Error creating table formtemplate: ",error.message);
            })
            tx.executeSql("CREATE TABLE IF NOT EXISTS form(id integer primary key, formTemplateId integer, fieldDefinitionId integer, formJson text)",
            [],
            function(tx, result) {
                
            },
            function(error) {
                console.log("Error creating table form: ",error.message);
            })
        },
        function(error) {
            console.log("Error in table transaction: ",error.message);
        },
        function () {
            console.log("Success creating Transaction table");
        })
    },
    insertFieldDefinition:function(name, type, width,element_id, element_class, formtemplateid,callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO fielddefinition (name, type, width, element_id, element_class, formtemplateid) VALUES(?,?,?,?,?,?)",
            [name, type, width, element_id, element_class, formtemplateid],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error.message);
            })
        })
    },
    insertFormTemplate:function(name, description, color, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO formtemplate (name, description, color) VALUES(?,?,?)",
            [name, description, color],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error.message);
            })
        })
    },
    insertForm:function(formTemplateId, fieldDefinitionId, formJson, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO form (formTemplateId, fieldDefinitionId, formJson) VALUES(?,?,?)",
            [formTemplateId, fieldDefinitionId, formJson],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error.message);
            })
        })
    },
    updateForm:function(formJson, formTemplateId, fieldDefinitionId,callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("UPDATE form SET formJson=? WHERE formTemplateId=? AND fieldDefinitionId=?",
            [formJson, formTemplateId,fieldDefinitionId],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error);
            })
        })
    },
    updateFieldDefinition:function(name, type, width,element_id, element_class,id,callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("UPDATE fielddefinition SET name=?, type=?, width=?, element_id=?, element_class=? WHERE id=?",
            [name, type, width,element_id, element_class,id],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error);
            })
        })
    },
    listFieldDefinition:function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM fielddefinition",
            [],
            function(tx, res) {
                // console.log("Result",res);
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
        
    },
    listFieldDefinitionByID:function(id, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM fielddefinition where formtemplateid=?",
            [id],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    listForm:function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM form",
            [],
            function(tx, res) {
                // console.log("Result",res);
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
        
    },
    listFormTemplates:function(callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM formtemplate",
            [],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    listFormTemplateByID:function(id, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM formtemplate where id=?",
            [id],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    listFormTemplateByName:function(name, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM formtemplate where name=?",
            [name],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    listFormByID:function(id, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM form where id=?",
            [id],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    listFormByFormTemplateID:function(formTemplateId, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM form where formTemplateId=?",
            [formTemplateId],
            function(tx, res) {
                callback(res)
            },
            function(error) {
                console.log("error listing: ",error.message);
            })
        })
    },
    updateFormTemplates:function(name, description,id,callback) {
        this.db.transaction(function(tx) {
            tx.executeSql("UPDATE formtemplate SET name=?, description=? WHERE id=?",
            [name, description, id],
            function(tx, res) {
                callback(res)
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error);
            })
        })
    },
}