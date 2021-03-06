const databaseHandler = {
  db: null,
  init: function () {
    this.db = window.sqlitePlugin.openDatabase({
      name: "my.db",
      location: "default",
    });

    this.db.transaction(
      function (tx) {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS fielddefinition(id integer primary key, name text, type text, width text, element_id text, element_class text, formtemplateid integer)",
          [],
          function (tx, result) {},
          function (error) {
            console.log(
              "Error creating table fielddefinition: ",
              error.message
            );
          }
        );

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS formTemplate(id integer primary key, name text, description text, color integer)",
          [],
          function (tx, result) {},
          function (error) {
            console.log("Error creating table formtemplate: ", error.message);
          }
        );
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS form(id integer primary key, formTemplateId integer, formJson text)",
          [],
          function (tx, result) {},
          function (error) {
            console.log("Error creating table form: ", error.message);
          }
        );

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS datasets(id integer primary key, name text, attribute1 text, attribute2 text, attribute3 text, attribute4 text, displayfieldname text, keyfieldname text)",
          [],
          function (tx, result) {},
          function (error) {
            console.log(
              "Error creating table fielddefinition: ",
              error.message
            );
          }
        );

      },
      function (error) {
        console.log("Error in table transaction: ", error.message);
      },
      function () {
        console.log("Success creating Transaction table");
      }
    );
  },
  insertFieldDefinition: function (
    name,
    type,
    width,
    element_id,
    element_class,
    formtemplateid,
    callback
  ) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO fielddefinition (name, type, width, element_id, element_class, formtemplateid) VALUES(?,?,?,?,?,?)",
        [name, type, width, element_id, element_class, formtemplateid],
        function (tx, res) {
          console.log("Insert Successful fielddefinition");
          callback(res);
        },
        function (error) {
          console.log("error inserting: ", error.message);
        }
      );
    });
  },
  insertFormTemplate: function (name, description, color, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO formtemplate (name, description, color) VALUES(?,?,?)",
        [name, description, color],
        function (tx, res) {
          callback(res);
          console.log("Insert Successful");
        },
        function (error) {
          console.log("error inserting: ", error.message);
        }
      );
    });
  },
  insertForm: function (formTemplateId, formJson, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO form (formTemplateId, formJson) VALUES(?,?)",
        [formTemplateId, formJson],
        function (tx, res) {
          callback(res);
          console.log("Insert Successful");
        },
        function (error) {
          console.log("error inserting: ", error.message);
        }
      );
    });
  },
  updateForm: function (formJson, formTemplateId, formId, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "UPDATE form SET formJson=? WHERE formTemplateId=? AND id=?",
        [formJson, formTemplateId,formId],
        function (tx, res) {
          callback(res);
          console.log("Insert Successful");
        },
        function (error) {
          console.log("error inserting: ", error);
        }
      );
    });
  },
  updateFieldDefinition: function (
    name,
    type,
    width,
    element_id,
    element_class,
    id,
    callback
  ) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "UPDATE fielddefinition SET name=?, type=?, width=?, element_id=?, element_class=? WHERE id=?",
        [name, type, width, element_id, element_class, id],
        function (tx, res) {
          callback(res);
          console.log("Insert Successful");
        },
        function (error) {
          console.log("error inserting: ", error);
        }
      );
    });
  },
  listFieldDefinition: function (callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM fielddefinition",
        [],
        function (tx, res) {
          // console.log("Result",res);
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFieldDefinitionByID: function (id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM fielddefinition where formtemplateid=?",
        [id],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listForm: function (callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM form",
        [],
        function (tx, res) {
          // console.log("Result",res);
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFormTemplates: function (callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM formtemplate",
        [],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFormTemplateByID: function (id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM formtemplate where id=?",
        [id],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFormTemplateByName: function (name, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM formtemplate where name=?",
        [name],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFormByID: function (id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM form where id=?",
        [id],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  listFormByFormTemplateID: function (formTemplateId, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM form where formTemplateId=?",
        [formTemplateId],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  updateFormTemplates: function (name, description, id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "UPDATE formtemplate SET name=?, description=? WHERE id=?",
        [name, description, id],
        function (tx, res) {
          console.log("Insert Successful");
          callback(res);
        },
        function (error) {
          console.log("error inserting: ", error);
        }
      );
    });
  },

  listFormWithTemplate: function (callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT form.id, form.formJson, FormTemplate.id as formTemplateId, FormTemplate.name, FormTemplate.description, FormTemplate.color FROM form INNER JOIN FormTemplate ON form.formtemplateid = FormTemplate.id",
        [],
        function (tx, res) {
          // console.log("Result",res);
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  
  listFormWithTemplateByID: function (id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT form.id, form.formJson, FormTemplate.id as formTemplateId, FormTemplate.name, FormTemplate.description, FormTemplate.color FROM form INNER JOIN FormTemplate ON form.formtemplateid = FormTemplate.id WHERE form.id=?",
        [id],
        function (tx, res) {
          // console.log("Result",res);
          callback(res);
        },
        function (error) {
          console.log("error listing: ", error.message);
        }
      );
    });
  },
  insertDataset: function (name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO datasets (name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname) VALUES(?,?,?,?,?,?,?)",
        [name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname],
        function (tx, res) {
          console.log("Insert dataset success",name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname);
          callback(res);
        },
        function (error) {
          console.log("error inserting dataset: ", error);
        }
      );
    });
  },
  listDatasets: function (callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM datasets",
        [],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing datasets: ", error.message);
        }
      );
    });
  },
  listDatasetsByID: function (id, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM datasets where id=?",
        [id],
        function (tx, res) {
          callback(res);
          // console.log("");
        },
        function (error) {
          console.log("error listing datasets: ", error.message);
        }
      );
    });
  },
  listDatasetsByName: function (name, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "SELECT * FROM datasets where name=?",
        [name],
        function (tx, res) {
          callback(res);
        },
        function (error) {
          console.log("error listing datasets: ", error.message);
        }
      );
    });
  },
  updateDataset: function (id, name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname, callback) {
    this.db.transaction(function (tx) {
      tx.executeSql(
        "UPDATE datasets SET name=?, attribute1=?, attribute2=?, attribute3=?, attribute4=?, displayfieldname=?, keyfieldname=? WHERE id=?",
        [name, attribute1, attribute2, attribute3, attribute4, displayfieldname, keyfieldname, id],
        function (tx, res) {
          console.log("update the dataset with id: ", id);
          callback(res);
        },
        function (error) {
          console.log("error updating dataset: ", error);
        }
      );
    });
  },
};
