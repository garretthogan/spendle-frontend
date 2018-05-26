import { baseUrl as devBaseUrl, plaidEnv as devPlaidEnv } from './dev';
import { baseUrl as prodBaseUrl, plaidEnv as prodPlaidEnv } from './prod';

export const baseUrl = process.env.NODE_ENV === 'development' ? devBaseUrl : prodBaseUrl;
export const plaidEnv = process.env.NODE_ENV === 'development' ? devPlaidEnv : prodPlaidEnv;
