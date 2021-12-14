const fileHandler={
    copyFileInit:function(filePath,onInitCopyFile, onErrorInitCopyFile) {
        window.resolveLocalFileSystemURL(filePath, entry => {
            // console.log(entry);
            // console.log("checking file path",entry.name);
            fileHandler.init(function(rootEntry) {
                onInitCopyFile(entry, rootEntry)
            })
        },(error)=>{
            window.resolveLocalFileSystemURL(filePath, entries=>{
                fileHandler.init(function(rootEntry) {
                    onInitCopyFile(entries, rootEntry)
                })
            },onErrorInitCopyFile)
            onErrorInitCopyFile(error);
        })
    },
    readFile:function(fileEntry, onSuccessReadFile, onErrorReadFile) {

        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                // console.log("Successful file read: ",fileEntry.toURL());
                onSuccessReadFile(this.result)
                // displayFileData(fileEntry.fullPath + ": " + this.result);
            };
    
            reader.readAsText(file);
    
        }, onErrorReadFile);
    },
    fileWrite:function(dataObj, fileEntry, successCallback, errorCallback) {
        fileEntry.createWriter(function (fileWriter) {
  
            fileWriter.onwriteend = function() {
                console.log("Successful file write...");
                successCallback()
                
            };
    
            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
                errorCallback(e)
            };
    
            fileWriter.write(dataObj);
        });  
    },
    createFile:function(fileName, dirEntry, successCallback, errorCallback) {
        dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

            successCallback(fileEntry)
    
        }, errorCallback);
    },
    createDirectory:function(folderName, dirEntry, callbackSuccess, callbackError) {
      dirEntry.getDirectory(folderName,{create:true},function(subDirEntry) {
          callbackSuccess(subDirEntry);
      },callbackError)  
    },
    init:function(callback) {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (rootDirEntry) {
            callback(rootDirEntry)
        });
    },


}