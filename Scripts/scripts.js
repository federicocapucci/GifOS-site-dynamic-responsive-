const apiKey = "Q00yquB0V7z2kBILVpxWX2yjxFghtbu3";
let tagcontainer = document.querySelector(".tagcontainer");
let imgcontainer = document.querySelector(".imgcontainer");
let searchtext = document.createElement('p');
searchtext.classList.add('separator');
searchlimit = 50;


let getRandom = async() => {

    let randomContainer = document.getElementsByClassName('randomcontainer')[0];
    for (let i = 0; i < 4; i++) {
        const newdiv = document.createElement("div");
        const newspam = document.createElement("spam");
        const newimg = document.createElement("img");
        const newbtn = document.createElement("a")
        newbtn.innerHTML = "Ver Mas...";
        newbtn.target = "_blank";
        newdiv.classList.add("randomSubContainer");
        newspam.classList.add("randSpam", "heading");
        newimg.classList.add('randImg', 'normalsize');
        newbtn.classList.add('button');
        newdiv.appendChild(newspam);
        newdiv.appendChild(newimg);
        newdiv.appendChild(newbtn);
        randomContainer.appendChild(newdiv);

    }


    randomDivArray = document.getElementsByClassName('randomSubContainer');
    randomSpamArray = document.getElementsByClassName('randSpam');
    randomImgArray = document.getElementsByClassName('randImg');
    randomBtnArray = document.getElementsByClassName('button');


    for (let i = 0; i < randomImgArray.length; i++) {
        const randomitems = await fetch('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey);
        const randomitemsjson = await randomitems.json();
        console.log(randomitemsjson);
        const x = document.createElement("img")
        x.src = "./assets/close.svg", x.alt = "close btn";
        x.onclick = (() => { x.classList.add('hide') });
        if (randomitemsjson.data.title == "") {
            randomSpamArray[i].innerHTML = "#Funny GIF";
        } else {
            randomSpamArray[i].innerHTML = "#" + randomitemsjson.data.title;
        }
        randomSpamArray[i].appendChild(x);
        randomImgArray[i].src = "https://media1.giphy.com/media/" + randomitemsjson.data.id + "/giphy.gif";
        randomImgArray[i].alt = randomitemsjson.data.title;
        randomBtnArray[i].href = randomitemsjson.data.bitly_url;

    }
}


let getTrending = async() => {
    const trending = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + "&limit=" + searchlimit);
    const trendingjson = await trending.json();
    console.log(trendingjson);
    for (let i = 0; i < trendingjson.data.length; i++) {

        const newimg = document.createElement("img");
        newimg.src = "https://media1.giphy.com/media/" + trendingjson.data[i].id + "/giphy.gif";
        newimg.alt = trendingjson.data[i].title;
        newimg.classList.add('pic')
        const anchor = document.createElement('a');
        anchor.href = trendingjson.data[i].bitly_gif_url
        anchor.target = "_blank";

        if (i % 5 == 4) {
            anchor.classList.add('bigsize');
        } else {
            anchor.classList.add('normalsize');
        }

        anchor.appendChild(newimg);
        imgcontainer.appendChild(anchor);
    }
}


let checkKey = (event) => {
    if (event.code === 'Enter') {
        empezarBusqueda();
    }
    return false;
}

let empezarBusqueda = () => {
    document.getElementsByClassName('separators')[0].classList.add('hide');
    imgcontainer.innerHTML = "";
    tagcontainer.innerHTML = "";
    let termino = document.getElementById('search').value;
    if (termino == "") {
        document.getElementsByClassName('separators')[0].classList.remove('hide');
        getTrending();
    } else {
        console.log("prueba:" + termino);
        getSearchResults(termino);
    }
}



let getSearchResults = async(search) => {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + "&limit=" + searchlimit);
    const jsoned = await found.json();
    console.log(jsoned);
    searchtext.innerHTML = "Resultados para '" + search + "'.";



    if (jsoned.data.length == 0) {
        searchtext.innerHTML = "No se encontraron resultados con el termino '" + search + "'.";
        tagcontainer.appendChild(searchtext);

    } else {

        let tagnum;
        if (jsoned.data.length > 20) {
            tagnum = 15
        } else {
            tagnum = jsoned.data.length
        }

        for (let j = 0; j < tagnum; j++) {

            const tagbtn = document.createElement("button");
            tagbtn.id = "tagbtn";

            let tagcontent = (tagbtn.innerHTML = jsoned.data[j].title);

            if (tagcontent != "" && tagcontent.length > 3) {

                console.log(tagbtn.innerHTML = tagcontent);

                tagcontainer.appendChild(tagbtn);

            } else {
                tagnum++;
            }

        }


        for (let i = 0; i < jsoned.data.length; i++) {

            const newimg = document.createElement("img");
            newimg.src = "https://media1.giphy.com/media/" + jsoned.data[i].id + "/giphy.gif";
            newimg.alt = jsoned.data[i].title;
            newimg.classList.add('pic')
            const anchor = document.createElement('a');
            anchor.href = jsoned.data[i].bitly_gif_url
            anchor.target = "_blank";

            if (i % 5 == 4) {
                anchor.classList.add('bigsize');
            } else {
                anchor.classList.add('normalsize');
            }

            anchor.appendChild(newimg);
            imgcontainer.appendChild(anchor);
        }
        tagcontainer.appendChild(searchtext);
    }
}