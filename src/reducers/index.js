import {
  SET_VALUE,
  SET_USER,
  SET_USER_ACCESS_TOKEN,
  SET_PLAID_ACCESS_TOKEN,
  SET_USER_ID,
  SET_PHONE_NUMBER,
  SET_INCOME_AFTER_BILLS,
  SET_PROGRESS_REPORT,
} from '../actions';

const initialState = {
  userAccessToken: null,
  plaidAccessToken: null,
  userId: '',
  phoneNumber: 11234567891,
  targetSavingsPercentage: 0,
  incomeAfterBills: 0,
  totalSpent: 0,
  spentLastWeek: 0,
  spentYesterday: 0,
  dailyBudget: 0,
  remainingBudget: 0,
  targetSavings: 0,
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
    case SET_PROGRESS_REPORT:
      return Object.assign({}, state, { ...action.payload });
    default:
      return state;
  }
};
