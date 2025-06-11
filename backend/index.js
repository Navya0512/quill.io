import http from 'http'
import app from './app.js';
let PORT=process.env.PORT;
let server=http.createServer(app);

server.listen(PORT,()=>{
    console.log(`Server is on PORT ${PORT}`);
})