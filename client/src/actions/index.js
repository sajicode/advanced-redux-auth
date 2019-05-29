import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './types';

export const signup = (formProps, callback) => async (dispatch) => {
	try {
		const response = await axios.post('http://localhost:3090/signup', formProps);

		dispatch({ type: AUTH_USER, payload: response.data.token });
		localStorage.setItem('token', response.data.token);
		callback();
	} catch (error) {
		dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
	}
};
// redux thunk allows us to return an action object or a function
