import dev from './dev';
import prod from './prod';

export const baseUrl = process.env.NODE_ENV === 'development' ? dev.baseUrl : prod.baseUrl;
export const plaidEnv = process.env.NODE_ENV === 'development' ? dev.plaidEnv : prod.plaidEnv;
