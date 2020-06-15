const apiKey = "Q00yquB0V7z2kBILVpxWX2yjxFghtbu3";
let container = document.querySelector(".imgcontainer");
let searchtext = document.createElement('p');
searchtext.classList.add('searchtext');
searchlimit = "50";

let checkKey = (event) => {
    let termino = document.getElementById('search').value;
    if (event.code === 'Enter') {
        getSearchResults(termino);
    }
    return false;

}

let empezarBusqueda = () => {
    container.innerHTML = "";
    let termino = document.getElementById('search').value;
    if (termino == "") {
        return
    } else {
        console.log("prueba:" + termino);
        getSearchResults(termino);
    }
}

let getSearchResults = async(search) => {
    const found = await fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey + "&limit=" + searchlimit);
    const jsoned = await found.json();
    console.log(jsoned);

    searchtext.innerHTML = "Results for '" + search + "'.";

    container.appendChild(searchtext);


    if (jsoned.data.length == 0) {
        const errormsg = document.createElement("p");
        errormsg.innerHTML = "No se encontraron resultados con el termino '" + search + "'.";
        container.appendChild(errormsg);


    } else {

        for (let i = 0; i < jsoned.data.length; i++) {

            const newimg = document.createElement("img");
            newimg.src = "https://media1.giphy.com/media/" + jsoned.data[i].id + "/giphy.gif"
            newimg.classList.add('pic')
            const newBtn = document.createElement('a');
            newBtn.href = jsoned.data[i].bitly_gif_url
            newBtn.target = "_blank";

            if (i % 5 == 0) {
                newBtn.classList.add('bigsize');
            } else {
                newBtn.classList.add('normalsize');
            }

            newBtn.appendChild(newimg);
            container.appendChild(newBtn);
        }
    }
}