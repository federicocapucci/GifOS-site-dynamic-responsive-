const apiKey = 'Q00yquB0V7z2kBILVpxWX2yjxFghtbu3';
let tagcontainer = document.querySelector('.tagcontainer');
let imgcontainer = document.querySelector('.imgcontainer');
let searchtext = document.createElement('p');
searchtext.classList.add('separator');
searchlimit = 50;


let getRandom = async() => {

    let randomContainer = document.getElementsByClassName('randomcontainer')[0];
    for (let i = 0; i < 4; i++) {
        const newdiv = document.createElement('div');
        const newspan = document.createElement('span');
        const newimg = document.createElement('img');
        const newbtn = document.createElement('a')
        newbtn.innerHTML = 'Ver Mas...';
        newbtn.target = '_blank';
        newdiv.classList.add('randomSubContainer');
        newspan.classList.add('randSpan', 'heading');
        newimg.classList.add('randImg', 'randomsize');
        newbtn.classList.add('button');
        newdiv.appendChild(newspan);
        newdiv.appendChild(newimg);
        newdiv.appendChild(newbtn);
        randomContainer.appendChild(newdiv);

    }


    randomDivArray = document.getElementsByClassName('randomSubContainer');
    randomSpanArray = document.getElementsByClassName('randSpan');
    randomImgArray = document.getElementsByClassName('randImg');
    randomBtnArray = document.getElementsByClassName('button');


    for (let i = 0; i < randomImgArray.length; i++) {
        const randomitems = await fetch('https://api.giphy.com/v1/gifs/random?api_key=' + apiKey);
        const randomitemsjson = await randomitems.json();
        console.log(randomitemsjson);
        const x = document.createElement('img')
        x.src = './assets/close.svg', x.alt = 'close btn';
        x.onclick = (() => { x.classList.add('hide') });
        if (randomitemsjson.data.title == '' || randomitemsjson.data.title == ' ') {
            randomSpanArray[i].innerHTML = '#Funny GIF';
        } else {
            randomSpanArray[i].innerHTML = '#' + randomitemsjson.data.title;
        }
        randomSpanArray[i].appendChild(x);
        randomImgArray[i].src = 'https://media1.giphy.com/media/' + randomitemsjson.data.id + '/giphy.gif';
        randomImgArray[i].alt = randomitemsjson.data.title;
        randomBtnArray[i].href = randomitemsjson.data.bitly_url;

    }
}


let getTrending = async() => {
    const trending = await fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=' + searchlimit);
    const trendingjson = await trending.json();
    console.log(trendingjson);
    for (let i = 0; i < trendingjson.data.length; i++) {
        const newdiv = document.createElement('div');
        const newimg = document.createElement('img');
        newimg.src = 'https://media1.giphy.com/media/' + trendingjson.data[i].id + '/giphy.gif';
        newimg.alt = trendingjson.data[i].title;
        newimg.classList.add('pic')
        const anchor = document.createElement('a');
        anchor.href = trendingjson.data[i].bitly_gif_url
        anchor.target = '_blank';
        const tags = document.createElement('a');
        tags.classList.add('tags');
        let realtags = trendingjson.data[i].title.split(' ');
        for (each of realtags) {
            tags.innerHTML += ' #' + each;
        }


        if (i % 5 == 4) {
            newdiv.classList.add('bigsize');
        } else {
            newdiv.classList.add('normalsize');
        }

        anchor.appendChild(newimg);
        newdiv.appendChild(anchor);
        newdiv.appendChild(tags);
        imgcontainer.appendChild(newdiv);

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
    imgcontainer.innerHTML = '';
    tagcontainer.innerHTML = '';
    let termino = document.getElementById('search').value;
    if (termino == '') {
        document.getElementsByClassName('separators')[0].classList.remove('hide');
        getTrending();
    } else {
        console.log('prueba:' + termino);
        getSearchResults(termino);
    }
}



let getSearchResults = async(search) => {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + '&limit=' + searchlimit);
    const jsoned = await found.json();
    console.log(jsoned);
    searchtext.innerHTML = 'Resultados para "' + search + '".';



    if (jsoned.data.length == 0) {
        searchtext.innerHTML = 'No se encontraron resultados con el termino "' + search + '".';
        tagcontainer.appendChild(searchtext);

    } else {

        let tagnum;
        if (jsoned.data.length > 20) {
            tagnum = 15
        } else {
            tagnum = jsoned.data.length
        }

        for (let j = 0; j < tagnum; j++) {

            const tagbtn = document.createElement('button');
            tagbtn.id = 'tagbtn';

            let tagcontent = (tagbtn.innerHTML = jsoned.data[j].title);

            if (tagcontent != '' && tagcontent.length > 3) {

                console.log(tagbtn.innerHTML = tagcontent);

                tagcontainer.appendChild(tagbtn);

            } else {
                tagnum++;
            }

            tagbtn.onclick = (() => {
                let newSearch = document.getElementById('search').value = tagbtn.innerHTML;
                empezarBusqueda();
            })

        }


        for (let i = 0; i < jsoned.data.length; i++) {

            const newdiv = document.createElement('div');
            const newimg = document.createElement('img');
            newimg.src = 'https://media1.giphy.com/media/' + jsoned.data[i].id + '/giphy.gif';
            newimg.alt = jsoned.data[i].title;
            newimg.classList.add('pic')
            const anchor = document.createElement('a');
            anchor.href = jsoned.data[i].bitly_gif_url
            anchor.target = '_blank';
            const tags = document.createElement('a');
            tags.classList.add('tags');
            let realtags = jsoned.data[i].title.split(' ');
            for (each of realtags) {
                tags.innerHTML += ' #' + each;
            }

            if (i % 5 == 4) {
                newdiv.classList.add('bigsize');
            } else {
                newdiv.classList.add('normalsize');
            }

            anchor.appendChild(newimg);
            newdiv.appendChild(anchor);
            newdiv.appendChild(tags);
            imgcontainer.appendChild(newdiv);
        }
        tagcontainer.appendChild(searchtext);
    }
}