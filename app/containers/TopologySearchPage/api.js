import axios from 'axios';

import { API_URL } from '../../constants';

export const topologySearch = params => axios.get(`${API_URL}/topology-search`, {params}).then(resp => resp.data);
