class Flickr {
  constructor(config={}) {
    this.API_KEY = config.API_KEY;
    this.ALBUM_ID = config.ALBUM || "72157655208938916";
    this.API_GET_PHOTOS = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${this.API_KEY}&format=json&nojsoncallback=1`;
  }

  get_photos(album_id=""){
    album_id = album_id || this.ALBUM_ID;
    let deferred = $.Deferred();
    $.get(this.API_GET_PHOTOS + `&photoset_id=${album_id}`, function(res, err){
      console.log(res);
      console.log(err);
      if(res){
        deferred.resolve(res.photoset.photo);
      }else{
        console.log(res);
        console.log(err);
        deferred.reject("no photo");
      }
    });
    return deferred.promise();
  }

  get_photo_url(photo={}){
    if (photo) {
      return `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
    }
    return false;
  }
}
