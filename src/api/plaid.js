import 'isomorphic-fetch';
import {baseUrl} from '../config';
const headers = {
  'Content-Type': 'application/json'
}

const fetchToJson = (url, options) => fetch(url, options).then(res => res.json());

export const getPublicKey = () => fetchToJson(`${baseUrl}/public_key`)
  .catch(console.log);

export const getAccessToken = (publicKey) => fetchToJson(`${baseUrl}/get_access_token`, {
  method: 'POST',
  body: JSON.stringify({public_token: publicKey}),
  headers
}).catch(console.log);

export const getTransactions = (accessToken) => fetchToJson(`${baseUrl}/transactions`, {
  method: 'POST',
  body: JSON.stringify({access_token: accessToken}),
  headers
}).catch(console.log);
