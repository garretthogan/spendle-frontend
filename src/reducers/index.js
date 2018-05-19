import {TRANSACTIONS_LOADED, ACCESS_TOKEN_LOADED, SET_LOADING, SET_VALUE} from '../actions';
/**
 * To do:
 * - generate user id
 * - get phone number from user
 * - calculate spent this month
 */
const initialState = {
  accessToken: null,
  transactions: null,
  userId: 'abc123',
  phoneNumber: 12253374350,
  targetSavingsPercentage: 0,
  incomeAfterBills: 0,
  spentThisMonth: 0,
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
    case SET_VALUE:
      return Object.assign({}, state, {[action.payload.key]: action.payload.value})
    default:
      return state;
  }
}
