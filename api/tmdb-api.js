import fetch from 'node-fetch';

export const getUpcomingMovies = (page) => {
    return fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US${page}`
    ).then((response) => {
        if (!response.ok) {
            throw new Error(response.json().message);
        }
        return response.json();
    })
        .catch((error) => {
            throw error
        });
};

export const getMovies = (page) => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=${page}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.json().message);
      }
      return response.json();
    })
    .catch((error) => {
       throw error
    });
  };
  
    export const getTopRatedMovies = (page) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };
    
    export const getMovie = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
    
    export const getGenres = () => {
      return fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
          process.env.REACT_APP_TMDB_KEY +
          "&language=en-US"
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
    
    export const getMovieImages = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
    
      })
      .catch((error) => {
        throw error
     });
    };
    
    export const getMovieReviews = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
  
    export const getPersonPopular = (page) => {
      return fetch(
        `https://api.themoviedb.org/3/person/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
         throw error
      });
    };
  
    export const getPerson = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
  
    export const getPersonImages = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/person/${id}/images?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then( (response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
    
      })
      .catch((error) => {
        throw error
     });
    };
  
    export const getPersonCombinedCredit = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.REACT_APP_TMDB_KEY}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };
  
    export const getMovieCredits = (id) => {
      return fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.json().message);
        }
        return response.json();
      })
      .catch((error) => {
        throw error
     });
    };