export const TRANSACTIONS_LOADED = 'TRANSACTIONS_LOADED';
export const ACCESS_TOKEN_LOADED = 'PUBLIC_KEY_LOADED';
export const SET_LOADING = 'SET_LOADING';
export const SET_VALUE = 'SET_VALUE';

export const onTransactionsLoaded = (tranasctions) => ({
  type: TRANSACTIONS_LOADED,
  payload: tranasctions,
});

export const onAccessTokenLoaded = (token) => ({
  type: ACCESS_TOKEN_LOADED,
  payload: token,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setValue = (key, value) => ({
  type: SET_VALUE,
  payload: {key, value},
});
