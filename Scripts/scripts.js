const apiKey = "Q00yquB0V7z2kBILVpxWX2yjxFghtbu3";
let tagcontainer = document.querySelector(".tagcontainer");
let imgcontainer = document.querySelector(".imgcontainer");
let searchtext = document.createElement('p');
searchtext.classList.add('searchtext');
searchlimit = 50;

let checkKey = (event) => {
    let termino = document.getElementById('search').value;
    if (event.code === 'Enter') {
        empezarBusqueda();
    }
    return false;
}

let empezarBusqueda = () => {
    imgcontainer.innerHTML = "";
    tagcontainer.innerHTML = "";
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

            let tagcontent = tagbtn.innerHTML = jsoned.data[j].title;

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
            const newBtn = document.createElement('a');
            newBtn.href = jsoned.data[i].bitly_gif_url
            newBtn.target = "_blank";

            if (i % 5 == 0) {
                newBtn.classList.add('bigsize');
            } else {
                newBtn.classList.add('normalsize');
            }

            newBtn.appendChild(newimg);
            imgcontainer.appendChild(newBtn);
        }
        tagcontainer.appendChild(searchtext);
    }
}