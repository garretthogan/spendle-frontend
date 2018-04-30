import {TRANSACTIONS_LOADED, ACCESS_TOKEN_LOADED} from '../actions';

const initialState = {
  accessToken: null,
  transactions: null,
}
export default (state = initialState, action) => {
  switch(action.type) {
    case TRANSACTIONS_LOADED:
      return Object.assign({}, state, {transactions: action.payload});
    case ACCESS_TOKEN_LOADED:
      return Object.assign({}, state, {accessToken: action.payload});
    default:
      return state;
  }
}
