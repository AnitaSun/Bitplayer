"use_strict";

let _doms;


// --------------
// set dom locations
_doms = {
  body:       document.body,
  albumMode:  document.querySelector('album-mode'),
  albumArt:   document.querySelector('album-art' ),
  controller: document.querySelector('controller'),
  player:     document.querySelector('player'),
  audio:      document.querySelector('player audio')
};


// set event listeners
_doms.albumMode.addEventListener('dragover',   (e) => { e.preventDefault();      }, false);
_doms.albumMode.addEventListener('drop',       (e) => { FileManager.drop(e);     }, false);
_doms.albumMode.addEventListener('mouseover',  (e) => { Controller.activate();   });
_doms.albumMode.addEventListener('mouseout',   (e) => { Controller.deactivate(); });
_doms.albumArt .addEventListener('touchstart', (e) => { Controller.toggle();     });


// JS Media Tags --------------
const JSMediaTags = window.jsmediatags;


// File --------------
function File(raw) {
  this.raw      = raw;
  this.path     = raw.path;
  this.fileName = raw.fileName;
  this.type     = raw.type;
  this.metadata = null;
}



// File Manager --------------
// Static
const FileManager = () => {};

FileManager.extentions = [
  "audio/x-m4a",
  "audio/mp3"
];
FileManager.files = [];

FileManager.drop = (e) => {
  e.preventDefault();

  let newFiles = e.dataTransfer.files;
  let filesBuf = [];

  Object.keys(newFiles).forEach(i => {
    if(FileManager.extentions.indexOf(newFiles[i].type) > -1) {
      filesBuf.push(new File(newFiles[i]));
    }
  });
  FileManager.files = filesBuf.concat(FileManager.files);
  Player.loadFile(FileManager.files[0]);
};



// Player --------------
// Static
const Player = () => {};

Player.processing = false;
Player.file;

Player.loadFile = (file) => {
  Player.file = file;
  Player.initImageAndMetadata(file);
  Player.initAudio(file);
};

Player.initImageAndMetadata = (file) => {
  const mp3AlbumArt = (picture) => {
    let image = new Image();
    let base64String = "";

    for(let i = 0;  i < picture.data.length;  i++) {
      base64String += String.fromCharCode(picture.data[i]);
    }

    let imageURL = "data:" + picture.format + ";base64," + window.btoa(base64String);
    let blobURL = imageURL;
    image.src = blobURL;

    _doms.albumArt.innerHTML = '';
    _doms.albumArt.appendChild(image);
  };

  const defaultAlbumArt = () => {
    let image = new Image();
    image.src = "default.jpg";

    _doms.albumArt.innerHTML = '';
    _doms.albumArt.appendChild(image);
  };

  JSMediaTags.read(file.raw, {
    onSuccess: function(tag) {
      Player.file.metadata = tag;
      Controller.displayMetadata(Player.file);

      if(tag.tags.picture) {
        mp3AlbumArt(tag.tags.picture);

      } else {
        defaultAlbumArt();
      }
    },
    onError: function(error) {
      console.log(error);
    }
  });
};

Player.initAudio = (file) => {
  let audio   = document.createElement('audio');
  let blobURL = URL.createObjectURL(file.raw);
  audio.src = blobURL;

  Player.processing = true;
  Player.stop();
  _doms.player.appendChild(audio);

  audio.addEventListener('canplay', () => { Player.processing = false;  Player.play(audio); });
  audio.addEventListener('pause',   () => { Player.processing = false; });
};

Player.play = (audio) => {
  if(!Player.prosessing) {
    audio.play();
  }
}

Player.pause = (audio) => {
  if(!Player.prosessing) {
    _doms.audio.pause();
  }
}

Player.stop = (audio) => {
  _doms.player.innerHTML = '';
}



// Controller --------------
// Static
const Controller = () => {};

Controller.activate = () => {
  _doms.controller.setAttribute('active', 'true');
};

Controller.deactivate = () => {
  _doms.controller.removeAttribute('active');
};

Controller.toggle = () => {
  if(_doms.controller.getAttribute('active')) {
    _doms.controller.removeAttribute('active');

  } else {
    _doms.controller.setAttribute('active', 'true');
  }
};

Controller.displayMetadata = (file) => {
  _doms.controller.querySelector('track' ).innerHTML = file.metadata.tags.title || file.fileName;
  _doms.controller.querySelector('album' ).innerHTML = file.metadata.tags.album;
  _doms.controller.querySelector('artist').innerHTML = file.metadata.tags.artist;
};

Controller.Play  = () => {};
Controller.Pause = () => {};
Controller.Stop  = () => {};
Controller.Seek  = () => {};
