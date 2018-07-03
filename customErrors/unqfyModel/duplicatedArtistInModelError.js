class DuplicatedArtistInModelError extends Error {
    constructor() {
    super('DuplicatedArtistInModelError','Artist duplicated');
    }
    
}

module.exports = {
    DuplicatedArtistInModelError,
  };
  