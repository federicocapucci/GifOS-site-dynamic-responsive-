// variables
let apibaseURL = "https://api.giphy.com/v1/gifs/";
let gifosInstructions = document.getElementsByClassName('gifosInstructions')[0];
let mygifosbanner = document.getElementById('mygifosbanner');
let info = document.getElementById('info');
let screen = document.getElementsByTagName('video')[0];
let misGifosButtonHolder = document.getElementsByClassName('misGifosButtonHolder')[0];
let cancelBtnHolder = document.getElementById('cancelBtnHolder');
let recordBtnImgHolder = document.getElementById('recordBtnImgHolder');
let recordBtnImg = document.getElementById('recordBtnImg');
let recordBtn = document.getElementById('recordBtn');
let recordBtnHolder = document.getElementById('recordBtnHolder');
let upload = document.getElementById('upload');
let download = document.getElementById('download');
let copyURL = document.getElementById('copyURL');
let preview = document.getElementById('preview');
let mgContainer = document.getElementsByClassName('mygifosContainer')[0];
let numOfMyGifos = localStorage.getItem("numOfMyGifos") || 0;
let miGifosBar = document.getElementById('miGifosBar');
let savedgif = "";
let blob = null;
var recorder;
var stream;
let clock = document.getElementById('timer');
recording = false;


// funciones



let empezar = () => {
    cancelBtnHolder.classList.toggle('hide');
    screen.classList.toggle('hide');
    info.classList.toggle('hide');
    mygifosbanner.innerHTML = "Un chequeo antes de empezar";

    PrenderyMostrarCamara(); /*Funcion 1*/
    recordBtn.onclick = grabar; /*Cambio la funcion en el click*/
    recordBtnImgHolder.onclick = grabar;

}

async function PrenderyMostrarCamara() {
    preview.src = "";
    /*Activa la camara*/
    stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 480
                }
            }
        })
        /*Estrimea la camara*/
    screen.srcObject = stream;
    screen.play();

    recordBtnImgHolder.classList.toggle('hide')
    recordBtn.innerHTML = "Capturar";


}

let grabar = () => {

    recording = !recording /*Si era False, lo pone en True, y viceversa*/

    if (recording) {
        /*Si estoy grabando...*/
        clock.classList.toggle('hide');

        clock.innerHTML = "Starting..."
        mygifosbanner.innerHTML = "Capturando tu Gifo";
        preview.src = "";

        screen.style.display = "block";

        recordBtnHolder.style.opacity = 0;
        recordBtnImgHolder.style.opacity = 0;
        recordBtnImg.src = "./assets/recording.svg";
        recordBtnImgHolder.classList.add('listo');
        recordBtnHolder.classList.add('listo');
        setTimeout(() => {
            recordBtnHolder.style.opacity = 1
            recordBtnImgHolder.style.opacity = 1
        }, 900);
        recordBtnImgHolder.style.top = "4px";
        recordBtn.innerHTML = "Listo";

        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 5,
            width: 180,
            hidden: 120,
            onGifRecordingStarted: function() {

            },
        });
        recorder.startRecording();
        TimerFn();

    } else {
        /*Si NO estoy grabando */
        recordBtnImgHolder.classList.add('hide');
        upload.classList.toggle('hide');
        recordBtnHolder.style.background = "#FFF4FD"
        recordBtn.style.color = "black";
        recordBtn.innerHTML = "Repetir Toma";
        recordBtn.onclick = refresh;
        mygifosbanner.innerHTML = "Vista previa";

        recorder.stopRecording(() => {
            recording = false;

            screen.style.display = "none";

        })

        blob = recorder.getBlob();
        objectURL = URL.createObjectURL(blob);
        download.href = String(objectURL);
        download.download = "My Gifo.GIF"

        preview.classList.toggle('hide')
        preview.src = objectURL;
    }
}

let TimerFn = () => {
    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
        if (recording) {
            if (seconds < 100) {
                if (seconds <= 9) {
                    seconds = '0' + seconds;
                }
                clock.innerHTML = `0:0${minutes}:${seconds}`;

                seconds++;
            } else {
                minutes++;
                seconds = 0;
            }
        } else {
            clearInterval(timer)
        }
    }, 1000);
}


const createDataForApi = async() => {
    mygifosbanner.innerHTML = "Subiendo Guifo";
    upload.innerHTML = "Subiendo..."
    preview.src = "./assets/uploading.png"
    preview.style.filter = "none";
    clock.innerHTML = "";

    let form = new FormData();
    form.append('file', recorder.getBlob(), 'prueba.gif');
    const urlUpload = 'http://upload.giphy.com/v1/gifs'
    const configUpload = {
        method: 'POST',
        mode: 'cors',
        body: form
    }
    const ApiUpload = await fetch(`${urlUpload}?api_key=${apiKey}`, configUpload)
    upload.innerHTML = "Uploaded"
    if (ApiUpload.status != 200) {
        alert("Hubo un error subiendo tu Gifo, intenta nuevamente");
    }
    ApiUploadJson = await ApiUpload.json();
    numOfMyGifos++;
    localStorage.setItem("numOfMyGifos", numOfMyGifos);
    localStorage.setItem("Gif#" + numOfMyGifos, ApiUploadJson.data.id);

    mygifosbanner.innerHTML = "Guifo subido con exito";
    preview.src = objectURL;
    preview.style.width = "50%";
    preview.style.height = "240px";
    preview.style.margin = "5px";
    misGifosButtonHolder.style.width = "45%";
    let p = document.createElement('p');
    p.innerHTML = "Guifo creado con éxito";
    p.classList.add('exito');
    let misGifosButtonSubHolder = document.getElementById('misGifosButtonSubHolder');
    misGifosButtonSubHolder.classList.toggle('misGifosButtonSubHolder');
    misGifosButtonSubHolder.insertBefore(p, misGifosButtonSubHolder.firstChild);



    savedgif = "https://media1.giphy.com/media/" + ApiUploadJson.data.id + "/giphy.gif";

    recorder.destroy();
    recorder = null;
    screen.classList.toggle('hide');
    // preview.classList.toggle('hide');
    timer.classList.toggle('hide');
    upload.classList.toggle('hide');
    recordBtnHolder.classList.toggle('listo');
    recordBtn.innerHTML = "Listo";
    recordBtnHolder.classList.add('pushdown');
    download.classList.toggle('hide');
    copyURL.classList.toggle('hide');
    recordBtn.onclick = reloadMyGifos;
    showAllMyGifos();
}


let showAllMyGifos = () => {

    miGifosBar.innerHTML = "Mis Guifos: [" + numOfMyGifos + "]."

    mgContainer.innerHTML = "";

    let gifosArray = [];
    if (localStorage.length > 1) {

        for (let i = 0; i < localStorage.length; i++) {

            let keys = localStorage.key(i);

            let value = localStorage.getItem(localStorage.key(i));

            mygifo = {
                name: keys,
                id: value,
            }

            if (value.length == 18) gifosArray.push(mygifo); /* Todas los ids son de 18 letras, una buena forma de filtrar localstorage */

        }


        gifosArray.sort(compare);

        function compare(a, b) {

            let comparison = 0;
            if (a.name > b.name) {
                comparison = 1;
            } else if (a.name < b.name) {
                comparison = -1;
            }
            return comparison;
        }

        for (each of gifosArray) {
            let newdiv = document.createElement('div');
            let newimg = document.createElement('img');
            newdiv.classList.add("normalsize");
            newimg.classList.add("pic");
            newimg.src = "https://media1.giphy.com/media/" + each.id + "/giphy.gif";
            newdiv.appendChild(newimg);
            mgContainer.appendChild(newdiv);
        }

    }
}


let reloadMyGifos = () => {
    window.location.reload()
}

let ClipURL = async() => {
    await navigator.clipboard.writeText(savedgif);
    let p = document.createElement("p")
    p.innerHTML = "Link copiado!"
    p.style.fontSize = "20px";
    p.style.padding = "10px";
    p.style.background = "pink";
    p.style.position = "fixed";
    p.style.left = "50%";
    p.style.top = "50%";
    gifosInstructions.appendChild(p)
    setTimeout(() => p.style.display = "none", 1000)
}

let refresh = () => {
    window.location.reload()
}




recordBtn.onclick = empezar;
upload.onclick = createDataForApi;

function newFunction() {
    showAllMyGifos();
}