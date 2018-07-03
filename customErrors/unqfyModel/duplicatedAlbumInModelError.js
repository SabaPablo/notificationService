class DuplicatedAlbumInModelError extends Error {
    constructor() {
    super('DuplicatedAlbumInModelError','Album duplicated');
    }
    
}

module.exports = {
    DuplicatedAlbumInModelError,
  };
  