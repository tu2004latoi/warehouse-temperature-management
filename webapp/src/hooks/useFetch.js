import {useEffect} from 'react';
import {useReducer} from './useReducer';
import  {authApis} from '../configs/Apis';
import { useAuth } from '../context/AuthContext';

function fetchReducer(state, action) {
    switch (action.type) {
        case 'fetchAPI/request':
            return {...state, isLoading: action.isLoading};
        case 'fetchAPI/success':
        case 'fetchAPI/error':
            return {
                ...state,
                isLoading: action.isLoading,
                error: action.error,
                data: action.data,
            };
        default:
            return state;
    }
}

export const useFetch = (url) => {
    const {token} = useAuth();
    const [state, dispatch] = useReducer(fetchReducer, {
        data: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!token) return;
        (async () => {
            dispatch({
                type: 'fetchAPI/request',
                isLoading: true,
            });
            try {
                const API =  authApis();
                const res = await API.get(url);
                const json = res.data;

                dispatch({
                    type: 'fetchAPI/success',
                    isLoading: false,
                    error: null,
                    data: json,
                });
            } catch (err) {
                dispatch({
                    type: 'fetchAPI/error',
                    isLoading: false,
                    error: err,
                    data: [],
                });
            }
        })();
    }, [url, token]);

    // return { data: state.data, isLoading: state.isLoading, error: state.error};
    return {...state};
};