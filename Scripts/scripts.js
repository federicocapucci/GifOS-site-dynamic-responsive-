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
        // console.log(randomitemsjson);
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
    // console.log(trendingjson);
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




let checkKey = async(event) => {
    let input = document.getElementById('search');
    let button = document.getElementById('search-button');
    let icon = document.getElementById('s-icon');
    let searchSuggestions = document.getElementsByClassName('search-suggestions')[0];

    if (input.value === "") {
        button.disabled = true;
        button.classList.remove('search-button-on')
        icon.src = "./assets/lupa_inactive.svg"
        searchSuggestions.classList.add('hide')
    } else if (event.code === 'Enter') {
        empezarBusqueda();


    } else {
        button.disabled = false;
        icon.src = "./assets/lupa.svg"
        button.classList.add('search-button-on');
        searchSuggestions.innerHTML = '';
        let suggestion = document.createElement('a');
        let suggestion2 = document.createElement('a');
        let suggestion3 = document.createElement('a');

        suggestion.onclick = (() => {

            document.getElementById('search').value = suggestion.innerHTML;
            empezarBusqueda();

        })
        suggestion2.onclick = (() => {

            document.getElementById('search').value = suggestion2.innerHTML;
            empezarBusqueda();

        })
        suggestion3.onclick = (() => {

            document.getElementById('search').value = suggestion3.innerHTML;
            empezarBusqueda();

        })

        if (input.value.length > 2) {
            searchSuggestions.classList.remove('hide')

            const suggested = await fetch('http://api.giphy.com/v1/tags/related/' + input.value + '?api_key=' + apiKey);
            const suggestedjsoned = await suggested.json();
            // console.log(jsoned)

            suggestion.innerHTML = suggestedjsoned.data[0].name;
            suggestion2.innerHTML = suggestedjsoned.data[1].name;;
            suggestion3.innerHTML = suggestedjsoned.data[2].name;;

            // console.log(suggestion.innerHTML);
            searchSuggestions.appendChild(suggestion);
            searchSuggestions.appendChild(suggestion2);
            searchSuggestions.appendChild(suggestion3);
        }
    }
}

let empezarBusqueda = () => {
    document.getElementsByClassName('separators')[0].classList.add('hide');
    imgcontainer.innerHTML = '';
    tagcontainer.innerHTML = '';
    let termino = document.getElementById('search').value;
    document.getElementById('search').value = "";
    checkKey(event);



    if (termino == '') {
        document.getElementsByClassName('separators')[0].classList.remove('hide');
        getTrending();
    } else {
        // console.log('prueba:' + termino);
        getSearchResults(termino);
    }
}



let getSearchResults = async(search) => {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + '&limit=' + searchlimit);
    const jsoned = await found.json();
    // console.log(jsoned);
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

                // console.log(tagbtn.innerHTML = tagcontent);

                tagcontainer.appendChild(tagbtn);

            } else {
                tagnum++;
            }

            tagbtn.onclick = (() => {
                document.getElementById('search').value = tagbtn.innerHTML;
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


const changeThemeDay = () => {

    let styler = document.getElementById('styler');
    styler.href = "./styles/SailorDay.css";
    let logo = document.getElementById('toplogo');
    logo.src = "./assets/gifOF_logo.png"
    let favicon = document.getElementById('favicon');
    favicon.href = "./assets/gifOF_logo.png"
    showThemes();


}

const changeThemeNight = () => {

    let styler = document.getElementById('styler');
    styler.href = "./styles/SailorNight.css";
    let logo = document.getElementById('toplogo');
    logo.src = "./assets/gifOF_logo_dark.png"
    let favicon = document.getElementById('favicon');
    favicon.href = "./assets/gifOF_logo_dark.png"
    showThemes();
}

const showThemes = () => {

    let themeContainer = document.getElementsByClassName('themeContainer')[0];
    themeContainer.classList.toggle('hide');

}