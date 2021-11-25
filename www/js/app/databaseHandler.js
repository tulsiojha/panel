const databaseHandler ={
    db: null,
    init: function() {
        this.db=window.sqlitePlugin.openDatabase({
            name:'my.db',
            location:'default'
        });
        
        this.db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS fielddefinition(id integer primary key, name text, description text, formtemplateid integer)",
            [],
            function(tx, result) {
                
            },
            function(error) {
                console.log("Error creating table fielddefinition: ",error.message);
            })
            
            tx.executeSql("CREATE TABLE IF NOT EXISTS fieldTemplate(id integer primary key, name text)",
            [],
            function(tx, result) {
                
            },
            function(error) {
                console.log("Error creating table formtemplate: ",error.message);
            })
        },
        function(error) {
            console.log("Error in table transaction: ",error.message);
        },
        function () {
            console.log("Success creating Transaction table");
        })
    },
    insertData:function(name, description, formtemplateid) {
        this.db.transaction(function(tx) {
            tx.executeSql("INSERT INTO fielddefinition (name, description, formtemplateid) VALUES(?,?,?)",
            [name, description, formtemplateid],
            function(tx, res) {
                console.log("Insert Successful");
            },
            function(error) {
                console.log("error inserting: ",error.message);
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
            tx.executeSql("SELECT * FROM fielddefinition where id=?",
            [id],
            function(tx, res) {
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
}