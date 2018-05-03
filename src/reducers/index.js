import {TRANSACTIONS_LOADED, ACCESS_TOKEN_LOADED, SET_LOADING} from '../actions';

const initialState = {
  accessToken: null,
  transactions: null,
  loading: true,
}
export default (state = initialState, action) => {
  switch(action.type) {
    case TRANSACTIONS_LOADED:
      return Object.assign({}, state, {transactions: action.payload});
    case ACCESS_TOKEN_LOADED:
      return Object.assign({}, state, {accessToken: action.payload});
    case SET_LOADING:
      return Object.assign({}, state, {loading: action.payload});
    default:
      return state;
  }
}
