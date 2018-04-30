export const TRANSACTIONS_LOADED = 'TRANSACTIONS_LOADED';
export const ACCESS_TOKEN_LOADED = 'PUBLIC_KEY_LOADED';

export const onTransactionsLoaded = (tranasctions) => ({
  type: TRANSACTIONS_LOADED,
  payload: tranasctions,
});

export const onAccessTokenLoaded = (token) => ({
  type: ACCESS_TOKEN_LOADED,
  payload: token,
});
