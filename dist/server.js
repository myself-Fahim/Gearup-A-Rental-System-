
        import {createRequire} from 'module';
        const require = createRequire(import.meta.url);
        
import n from"express";var o=n();o.use(n.json());o.get("/",(a,p)=>{p.send("Server is Running")});var t=o;import{configDotenv as i}from"dotenv";import{env as e}from"process";i();var s={node_env:e.NODE_ENV,port:e.PORT,database_string:e.DATABASE_URL},r=s;r.node_env!="production"&&t.listen(3e3,()=>{console.log("Server is running at http://localhost:3000")});var v=t;export{v as default};
