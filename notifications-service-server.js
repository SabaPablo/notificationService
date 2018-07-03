let express = require('express'); 
const unqmod = require('./unqfy');
const fs = require('fs');
let bodyParser = require('body-parser');
let app = express();                
let router = express.Router();
let genericApiError = require('./customErrors/unqfyAPI/apiError');
let apiErrors = require('./customErrors/unqfyAPI/customAPIErrors')
let duplicatedAlbumError = require('./customErrors/unqfyModel/duplicatedAlbumInModelError')
let duplicatedArtistError = require('./customErrors/unqfyModel/duplicatedArtistInModelError')


/*

function getUNQfy(filename) {
    let unqfy = new unqmod.UNQfy();
    if (fs.existsSync(filename)) {
      unqfy = unqmod.UNQfy.load(filename);
    }
    return unqfy;
  }
  
function saveUNQfy(unqfy, filename) {
    unqfy.save(filename);
}

let lastArtId = 0;
function generateIdForArtist(){
    let id = lastArtId;
    lastArtId +=1;
    return id;
}

let lastAlbumId = 0;
function generateIdForAlbum(){
    let id = lastAlbumId;
    lastAlbumId +=1;
    return id;
}
*/
function errorHandler(err, req, res, next) {
    console.error(err); // imprimimos el error en consola

    if (err instanceof genericApiError.APIError){
        res.status(err.status);
        res.json({status: err.status, errorCode: err.errorCode});
    } 
    
    else if (err.type === 'entity.parse.failed'){
        res.status(err.status);
        res.json({status: err.status, errorCode: 'BAD_REQUEST'});
    } 
    
    else if ( err instanceof apiErrors.ResourceNotFound){
        res.status(err.status);
        res.json({status: 404, errorCode: 'RESOURCE_NOT_FOUND'});
    }
    
    else {
        next(err);
    }
}

let unqfy = getUNQfy('db_UNQFy');
let port = process.env.PORT || 5000; 

router.use(function (req, res, next) {
    next(); 
});

router.get('/', function (req, res) {
    res.json({ message: 'welcome' });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.use(errorHandler);
app.use(function(req, res){
    res.status(404);
    res.json({status: 404, errorCode: "RESOURCE_NOT_FOUND"});
});


/////////////
// Artistas
/////////////

router.route('/artists')
.post(function (req, res) {

    let name = req.body.name;
    let country = req.body.country;

    if (name === undefined || country === undefined){throw new apiErrors.BadRequest;}

    let id = generateIdForArtist();
    try {
        unqfy.addArtist({name,country,id});
    }
    catch (e){
        if (e instanceof duplicatedArtistError.DuplicatedArtistInModelError){
            throw new apiErrors.ResourceDuplicated;
        }
    }
    res.json({'id': id,'name':name,'country':country,'albums': []});
})
.get(function (req, res) {
    
    let artistName = req.query.name;
    if (artistName !== undefined){
        let artists = unqfy.getArtistLikeName(artistName);
        res.json(artists ? artists : []);
    }
    else{
        res.json(unqfy.getAllArtists());
    }
    
});


router.route('/artists/:artistId')
.get(function (req, res) {
    
    let artist = unqfy.getArtistById(req.params.artistId);
    if (artist){
        res.json(artist.toJSON());
    }
    else{
        throw new apiErrors.ResourceNotFound;
    }
    
})
.delete(function (req, res) {

    let artist = unqfy.getArtistById(req.params.artistId);

    if(!artist){throw new apiErrors.ResourceNotFound;}

    unqfy.deleteArtist(artist);
    res.json({'Status Code': 200});
});


/////////////
// Albums
/////////////


let albumIdCounter = 0;
router.route('/albums')
.post(function (req, res) {

    let artistId = req.body.artistId;
    let albumName = req.body.name;
    let albumYear = req.body.year;

    if (artistId === undefined || albumName === undefined || albumYear === undefined){
        throw new apiErrors.BadRequest;
    }

    let artist = unqfy.getArtistById(artistId);

    if (!artist){throw new apiErrors.RelatedResourceNotFound; }

    let albumID = generateIdForAlbum();
    
    try {
        unqfy.addAlbum(artist.name,{name:albumName,year:albumYear,id:albumID});
    }
    catch (e){
        if (e instanceof duplicatedAlbumError.DuplicatedAlbumInModelError){
            throw new apiErrors.ResourceDuplicated;
        }
    }
    res.json(unqfy.getAlbumById(albumID).toJSON());
})
.get(function (req, res) {

    let albumName = req.query.name;
    if (albumName !== undefined){
        let album = unqfy.getAlbumLikeName(albumName);
        res.json(album ? album : []);
    }
    else{
        res.json(unqfy.getAllAlbums());
    }
    
});


router.route('/albums/:albumId')
.get(function (req, res) {
    let albumId = req.params.albumId;
    let album = unqfy.getAlbumById(albumId);
    if (!album){throw new apiErrors.ResourceNotFound;}
    res.json(album.toJSON());
})
.delete(function (req, res) {
    
    let album = unqfy.getAlbumById(req.params.albumId);
    if (!album){throw new apiErrors.ResourceNotFound;}
    unqfy.deleteAlbum(album);
    res.json({'Status Code': 200});
});

app.listen(port);
console.log("Server started on port: %s",port);

saveUNQfy(unqfy,'db_UNQFy');


