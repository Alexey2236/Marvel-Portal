import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import './charInfo.scss';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';

function CharInfo(props) {
    const [char, setChar] = useState(null);
    
    
    const {loading, error, getСharacter, clearError} = useMarvelService();


    useEffect(() => {
        updateChar();
        
    }, [props.charId])


    const updateChar = () => {
        clearError();
        const {charId} = props;
        if(!charId) {
            return;
        }
         getСharacter(charId)
            .then(onCharLoaded)
    }
   

  

    const onCharLoaded = (char) => {
        setChar(char);
    }

    
        const skeleton =  char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner =  loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ?  <Vue char={char}/> : null;

        return (
            <div className="char__info">
               {skeleton}
               {errorMessage}
               {spinner}
               {content}
            </div>
        )
}

const Vue = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;
            let imgStyle = {objectFit: "cover"};
            if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
            imgStyle = {objectFit: "contain"}
        }

     
    const comicses = comics.slice(0, 10).map((item, i) => {
            return (
                <li key={i} className="char__comics-item">{item.name}</li>
            )
        })

    return (
        <>
         <div className="char__basics">
                    <img style={imgStyle} src={thumbnail} alt={name}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                   {description ? description.slice(0, 200) + '...' : "To see the description follow the link"}
                </div>
                <div className="char__comics">Comics:</div>
                    <ul className="char__comics-list">
                        {comics.length > 0 ? comicses : 'This character has no comics'}
                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number, 
}

export default CharInfo;