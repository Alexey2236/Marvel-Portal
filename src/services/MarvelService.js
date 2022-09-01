import {useHttp} from '../hooks/http.hook'

function useMarvelService() {
    const {loading, request, error, clearError} = useHttp();

    const  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const  _apiKey = 'apikey=1996d7636de6a3d05d0b2230eda1943c';
    const _baseOffset = 400;
   

    const getAllСharacters = async (offset = _baseOffset) => {
        const res =  await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }
   
    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getСharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }
   

    const _transformCharacter = (char) => {
        return {
            id: char.id, 
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, 
            homepage: char.urls[0].url, 
            wiki: char.urls[1].url, 
            comics: char.comics.items, 
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available'
        }
    }
    return {loading, error, getAllСharacters, getСharacter, getComic, getAllComics,  clearError}
}

export default useMarvelService;