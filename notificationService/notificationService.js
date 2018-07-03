
class NotificationService{

    constructor(){
        this.suscriptorsByArtist = {};
        this.notificators = []
    }

    addSuscriptorToArtist(suscriptorMail,artistId){

        // Si unquify me dice que existe sigo sino explota 

        if (!this.suscriptorsByArtist[artistId]){
            this.suscriptorsByArtist[artistId] = [];
        }
        this.suscriptorsByArtist[artistId] = this.suscriptorsByArtist[artistId].concat(suscriptorMail)
    }

    getSuscriptorsForArtist(artistId){
        if (this.suscriptorsByArtist[artistId]){
            return this.suscriptorsByArtist[artistId];
        }
        else{
            // Tiro ArtistNotFound except
            //throw new ArtistNotFound();
        }
    }

    deleteSuscriptorFromArtist(suscriptorMail,artistId){
        
        if (!this.suscriptorsByArtist[artistId].contains(suscriptorMail)){
            this.suscriptorsByArtist[artistId] = this.suscriptorsByArtist[artistId].filter(mail => mail !== suscriptorMail);
        }
        else{
            // Lanzo algun error porque o no esxiste el artista o no estaba suscripto
        }
    }

    notifySuscriptorOf(artistId,subject,message,from){

        // mail sender manda el mail si falla explota?

    }

}
