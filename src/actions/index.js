export const SET_VALUE = 'SET_VALUE';
export const SET_USER = 'SET_USER';
export const SET_USER_ACCESS_TOKEN = 'SET_USER_ACCESS_TOKEN';
export const SET_PLAID_ACCESS_TOKEN = 'SET_PLAID_ACCESS_TOKEN';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_INCOME_AFTER_BILLS = 'SET_INCOME_AFTER_BILLS';
export const SET_TOP_TRANSACTIONS = 'SET_TOP_TRANSACTIONS';

export const setUser = user => ({
  type: SET_USER,
  payload: { ...user },
});

export const setUserAccessToken = token => ({
  type: SET_USER_ACCESS_TOKEN,
  payload: token,
});

export const setPlaidAccessToken = token => ({
  type: SET_PLAID_ACCESS_TOKEN,
  payload: token,
});

export const setUserId = id => ({
  type: SET_USER_ID,
  payload: id,
});

export const setPhoneNumber = number => ({
  type: SET_PHONE_NUMBER,
  payload: number,
});

export const setIncomeAfterBills = amount => ({
  type: SET_INCOME_AFTER_BILLS,
  payload: amount,
});

export const setValue = (key, value) => ({
  type: SET_VALUE,
  payload: { key, value },
});

export const setTopTransactions = transactions => ({
  type: SET_TOP_TRANSACTIONS,
  payload: transactions,
});
