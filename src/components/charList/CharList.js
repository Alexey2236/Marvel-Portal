import {useState, useEffect} from 'react';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import { TransitionGroup, Transition} from 'react-transition-group';

import './charList.scss';

const CharList = (props) => {

    const duration = 500;

    const defaultStyle = {
        transition: `all ${duration}ms ease-in-out`,
        opacity: 0,
    }

    const transitionStyles = {
        entering: { opacity: 0},
        entered:  { opacity: 1},
       
    };

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(400);
    const [charEnded, setCharEnded] = useState(false);
   
    const {loading, error,  getAllСharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

   const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllСharacters(offset)
        .then(onCharListLoaded);
    }
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);

    }
    
    function renderItems(arr) {
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                    imgStyle = {'objectFit' : 'unset'};
                }
            return (
                <Transition key={item.id} in={newItemLoading} timeout={duration}>
                    {state => (
                        <li 
                        className="char__item"
                        key={item.id}
                        onClick={() => props.onCharSelected(item.id)}
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                          }}
                        >
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                            <div className="char__name">{item.name}</div>
                    </li>
                    )}
                </Transition>
            )
        });
        
        return (
            <TransitionGroup component={'ul'} className="char__grid">
                {items}
            </TransitionGroup>
        )
        
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? "none" : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;
