const ipcRender = require("electron").ipcRenderer;
var fs = require("fs");
const process = require("child_process");
const selectDirectory = document.getElementById("select-directory");
const uploadFile = document.getElementById("upload-file");
const convert = document.getElementById("convert");
const newProjectOver = document.getElementById("newProject_over");
const newProject = document.getElementById("newProject");

const info = document.getElementById("info");

var outputPath = "";
var videoFile = "";
var format = "m3u8";
// if (!fs.existsSync(dir)) fs.mkdirSync(dir);

newProject.addEventListener("click", () => {
  document.getElementById("optionContainer").style = "display:block";
  document.getElementById("convertContainer").style = "display:none;";
  document.getElementById("newContainer").style = "display:none";
});

selectDirectory.addEventListener("click", (event) => {
  ipcRender.send("select-dirs");
});

uploadFile.addEventListener("click", () => {
  ipcRender.send("open-file-dialog-for-file");
});

convert.addEventListener("click", () => {
  info.innerHTML = `<br/>
    <div class='alert alert-success'>
    Convertion process started..
    </div>`;

  // Convertion Process
  process.exec(
    //$ ffmpeg -i filename.mp4 -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls filename.m3u8
    `"${__dirname}\\bin\\ffmpeg" -i "${videoFile}" -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${outputPath}\\test.${format}"`,
    (error, stdout, stderr) => {
      console.log(stdout);
      info.innerHTML = `<br/>
    <div class='alert alert-success'>
    Convertion completed.
    </div>`;
      setTimeout(function () {
        info.innerHTML = "";
      }, 5000);
      Notification.requestPermission().then((result) => {
        var myNotification = new Notification("Converstion Completed", {
          body: "Your file was successfully converted",
        });
      });
      if (error !== null) {
        info.innerHTML = `<br/>
    <div class='alert alert-danger'>
      ${error}
    </div>`;
        console.log(error);
      }
    }
  );
});

newProjectOver.addEventListener("click", () => {
  document.getElementById("optionContainer").style = "display:block";
  document.getElementById("convertContainer").style = "display:none;";
  document.getElementById("newContainer").style = "display:none";
  uploadFile.style = "display:none";
});

ipcRender.on("selected-file", (event, path) => {
  videoFile = path;
  info.innerHTML = `<br/>
    <div class='alert alert-success'>
    All Set, ready to convert
    </div>`;
  setTimeout(function () {
    info.innerHTML = "";
  }, 5000);
  document.getElementById("optionContainer").style = "display:none";
  document.getElementById("convertContainer").style = "display:block;";
  document.getElementById("newContainer").style = "display:none";
});

ipcRender.on("select-dirs", (event, path) => {
  // console.log("event :" + event);
  // console.log("path : " + path);
  fs.readdir(path, (err, files) => {
    if (err) {
      showMsg(err, "danger");
      uploadFile.style = "display:none";
    } else {
      if (files.length > 0) {
        showMsg("Please select empty directory", "danger");
        uploadFile.style = "display:none";
      } else {
        outputPath = path;
        uploadFile.style = "display:block";
        showMsg("Please select video file", "success");
      }
    }
  });

  // if (!condition) {
  // } else {
  //   outputPath = path;
  //   uploadFile.style = "pointer-events:all";
  // info.innerHTML = `<br/>
  //   <div class='alert alert-success'>
  //   ${path} is converting, so please wait in a while
  //   </div>`;

  // setTimeout(function () {
  //   info.innerHTML = "";
  // }, 5000);

  // // Convertion Process
  // process.exec(
  //   `ffmpeg -i "${path}" media/test.${format}"`,
  //   (error, stdout, stderr) => {
  //     console.log(stdout);
  //     info.innerHTML = `<br/>
  //   <div class='alert alert-success'>
  //   Convertion completed.
  //   </div>`;
  //     setTimeout(function () {
  //       info.innerHTML = "";
  //     }, 5000);

  //     Notification.requestPermission().then((result) => {
  //       var myNotification = new Notification("Converstion Completed", {
  //         body: "Your file was successfully converted",
  //       });
  //     });
  //     if (error !== null) console.log(error);
  //   }
  // );
  // }
});

function showMsg(msg, className) {
  info.innerHTML = `<br/>
  <div class='alert alert-${className}'>
  ${msg}
  </div>`;
  setTimeout(function () {
    info.innerHTML = "";
  }, 5000);
}
