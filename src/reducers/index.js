import {
  SET_VALUE,
  SET_USER,
  SET_USER_ACCESS_TOKEN,
  SET_PLAID_ACCESS_TOKEN,
  SET_USER_ID,
  SET_PHONE_NUMBER,
  SET_INCOME_AFTER_BILLS,
  SET_TOP_TRANSACTIONS,
} from '../actions';

const initialState = {
  userAccessToken: null,
  plaidAccessToken: null,
  userId: '',
  phoneNumber: 11234567891,
  targetSavingsPercentage: 0,
  incomeAfterBills: 0,
  spentThisMonth: 0,
  topTransactions: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_VALUE:
      return Object.assign({}, state, { [action.payload.key]: action.payload.value });
    case SET_USER:
      return Object.assign({}, state, { ...action.payload });
    case SET_USER_ACCESS_TOKEN:
      return Object.assign({}, state, { userAccessToken: action.payload });
    case SET_PLAID_ACCESS_TOKEN:
      return Object.assign({}, state, { plaidAccessToken: action.payload });
    case SET_USER_ID:
      return Object.assign({}, state, { userId: action.payload });
    case SET_PHONE_NUMBER:
      return Object.assign({}, state, { phoneNumber: action.payload });
    case SET_INCOME_AFTER_BILLS:
      return Object.assign({}, state, { incomeAfterBills: action.payload });
    case SET_TOP_TRANSACTIONS:
      return Object.assign({}, state, { topTransactions: action.payload });
    default:
      return state;
  }
};
