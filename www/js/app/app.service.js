var app = angular.
  module('Home');

app.service('panelUtils', function () {

  this.errorMessage = "";
  this.mapModalIsOpened = false;
  this.errorModalIsOpened = false;
  this.progressModalIsOpened = false;

  
  this.mediaIcons = {
    mp3: "music.png",
    wav: "music.png",
    mp4: "video.png",
    mpg: "video.png",
    mpeg: "video.png",
    mkv: "video.png",
    png: "image.png",
    jpg: "image.png",
    jpeg: "image.png",
    gif: "image.png",
    bmp: "image.png",
    svg: "image.png",
    pdf: "pdf.png",
    zip: "zip.png",
    "7z": "zip.png",
    others: "other.png",
  };


  this.colorBold = "hsl(216, 98%, 52%)";
  this.colorLight = "hsl(216, 98%, 52%, 40%)";

  this.getExtension = function (file) {
    return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  this.getIcon = function (extension) {
    return this.mediaIcons[extension]
      ? this.mediaIcons[extension]
      : this.mediaIcons["others"];
  };

  this.formatName = function (fileName) {
    return fileName.length > 50 ? fileName.substring(0, 47) + "..." : fileName;
  };

  this.getErrorModal = () => {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById("errorModal"))
  };

  this.getMapModal = () => {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById("mapModal"))
  };

  this.getProgressModal = () => {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById("progressModal"))
  };
});