(function(){

  $('#butRefresh').click(function(){
    app.isLoading = true;
    app.spinner.removeAttribute('hidden');
    app.getPhotos();
  });

  var app = {
    flickr: new Flickr({"API_KEY": "c034bfd227f19d6ad1b1f8f49aeb7357", "ALBUM": "72157641870787614"}),
    isLoading: true,
    hasRequestPending: false,
    visibleCards: {},
    loadedPhotos: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container')
  };

  app.getPhotos = function(){
    console.log('get photos...');
    app.flickr.get_photos().then(function(photos){
      let html = "";
      if(photos){
        localStorage.setItem('flickr_photos', JSON.stringify(photos));
      }
      photos.forEach(photo => {
        app.loadPhoto(photo);
      });
    }).then(function(){
      if (app.isLoading) {
        app.spinner.setAttribute('hidden', true);
        app.container.removeAttribute('hidden');
        app.isLoading = false;
      }
    });
  };

  app.loadPhoto = function(photo){
    let url = app.flickr.get_photo_url(photo);
    card = app.visibleCards[url];
    if(!card){
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.removeAttribute('hidden');
      card.querySelector('.content').src = url;
      app.container.appendChild(card);
      app.visibleCards[url] = card;
    }
  };

  app.loadedPhotos = JSON.parse(localStorage.getItem('flickr_photos'));

  if (app.loadedPhotos) {
    console.log('cached');
    app.loadedPhotos.forEach(photo => {
      app.loadPhoto(photo);
    })
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  }else {
    app.getPhotos();
  }

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})()
