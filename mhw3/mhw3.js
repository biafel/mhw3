const form = document.querySelector('form');
form.addEventListener('submit', Cerca);

const testo = document.querySelector('#testo');
const bottone = testo.querySelector('#submit');
bottone.addEventListener('click', lyrics);


const client_id = '6abaa1a35fcf404f9a1fafdb50ed4b29';
const client_secret = '86bdad9569b2428486f852fc736fd654';

let token;

function onResponse(response) {
   console.log('Risposta ricevuta');
    return response.json();
  }

  function onJson(json) {
    console.log('sdfg'); 
    // Svuotiamo la libreria
    const library = document.querySelector('#cover');
    library.innerHTML = '';
    // Leggi il numero di risultati
    const results = json.albums.items;
    let num_results = results.length;
    // Mostriamone al massimo 10
    if(num_results > 10)
      num_results = 10;
    // Processa ciascun risultato
    for(let i=0; i<num_results; i++)
    {
      
      // Leggi il documento
      const lista = results[i]
      // Leggiamo info
      const title = lista.name;
      const selected_image = lista.images[0].url;
      // Creiamo il div che conterrà immagine e didascalia
      const songs = document.createElement('div');
      songs.classList.add('stile');
      const img = document.createElement('img');
      img.src = selected_image;
      const caption = document.createElement('p');
      caption.textContent = title;
      const link= document.createElement('a');
      link.setAttribute('href', lista.external_urls.spotify);
      link.textContent = "Apri su spotify";

      // Aggiungiamo immagine e didascalia al div
      songs.appendChild(img);
      songs.appendChild(caption);
      songs.appendChild(link);
      //Aggiungiamo il div all'article
      library.appendChild(songs);
  
    }
  } 


function Cerca(event){
    event.preventDefault();
    const tracks = document.querySelector('#brano');
    const tracks_value = encodeURIComponent(tracks.value);
    console.log('Eseguo ricerca: ' + tracks_value);
    console.log(tracks.value);
    console.log(tracks_value);

    //richiesta
    fetch("https://api.spotify.com/v1/search?type=album&q=" + tracks_value,
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJson);
  }

  function onTokenJson(json){
 //   console.log(json)
    // Imposta il token global
    token = json.access_token;
  }
  
  function onTokenResponse(response){
    return response.json();
  }
  
  fetch("https://accounts.spotify.com/api/token",
  {
 method: "post",
 body: 'grant_type=client_credentials',
 headers:
 {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
 }
}
).then(onTokenResponse).then(onTokenJson);


function lyrics(event){
  event.preventDefault();
  const text_artista = testo.querySelector('#nome_artista');
  const text_brano = testo.querySelector('#nome_brano');
  const url = "https://api.lyrics.ovh/v1/"
  if(text_artista.value === "" || text_brano.value === ""){
    alert("Entrambi i campi devono essere compilati.")
  }else{
    fetch(url + text_artista.value + "/" + text_brano.value).then(onResponseCatch).then(onJsonDue);
  }
}

function onResponseCatch(response){
  return response.json();
}

function onJsonDue(json){
  const text_artista = testo.querySelector('#nome_artista');
  const text_lyrics = testo.querySelector('#text_lyrics');
  if(json.error === "No lyrics found"){
    alert("Non è stato trovato alcun brano di " + text_artista.value);
  }else{
    text_lyrics.innerHTML = "";
    text_lyrics.innerHTML = json.lyrics;
  }
}
