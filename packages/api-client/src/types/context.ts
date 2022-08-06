
import { ApiClientMethods, IntegrationContext } from '@vue-storefront/core';
import { Config } from './config';
import { Endpoints } from './api';
import { AxiosInstance } from 'axios';

export type Context = IntegrationContext<AxiosInstance, Config, ApiClientMethods<Endpoints>>;
