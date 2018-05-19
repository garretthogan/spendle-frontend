import 'isomorphic-fetch';
import moment from 'moment';
import {baseUrl} from '../config';
const headers = {
  'Content-Type': 'application/json'
}
const start = moment().subtract(6, 'months').startOf('month');
const end = moment();

const fetchToJson = (url, options) => fetch(url, options).then(res => res.json());

export const getPublicKey = () => fetchToJson(`${baseUrl}/public_key`)
  .catch(console.log);

export const getAccessToken = (publicKey) => fetchToJson(`${baseUrl}/get_access_token`, {
  method: 'POST',
  body: JSON.stringify({public_token: publicKey}),
  headers
}).catch(console.log);

export const getTransactions = (accessToken, dateRange = {start, end}) => fetchToJson(`${baseUrl}/transactions`, {
  method: 'POST',
  body: JSON.stringify({access_token: accessToken, start_date: dateRange.start, end_date: dateRange.end}),
  headers
}).catch(console.log);

export const createBudget = (amount, frequency = 'monthly') => fetchToJson(`${baseUrl}/create_budget`, {
  method: 'POST',
  body: JSON.stringify({amount, frequency}),
  headers
});

export const saveBudget = (userData) => fetchToJson(`${baseUrl}/save_budget`, {
  method: 'POST',
  body: JSON.stringify(userData),
  headers
});

const startOfMonth = monthsAgo => moment().subtract(monthsAgo, 'months').startOf('month');
const endOfMonth = monthsAgo => moment().subtract(monthsAgo, 'months').endOf('month');

export const getTransactionsInRange = (accessToken, monthsAgo) => {
  const promises = [];
  for(let i = monthsAgo; i > 0; i--) {
    promises.push(getTransactions(accessToken, {start: startOfMonth(monthsAgo), end: endOfMonth(monthsAgo)}));
  }
  return Promise.all(promises).then(range => [].concat(...range));
}
