import axios from 'axios';

const http = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'https://acimg.micerlabs.com/momscut/api' : 'http://127.0.0.1:8088/api'
});

export default http;
