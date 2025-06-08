import http from 'http';
import express from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';

const porta = 3001;
const host = "localhost";
const app = express();
var listaProdutos = [];

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15, httpOnly: true, secure: false }
}));

app.use(cookieParser());

app.get("/login", (req, res) => {
    res.send(`
    <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Login</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
     
 </head>
 <body>

       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
 </body>
 </html>
    `); 
    res.end();      
 });

 app.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    
    if(usuario && senha) {
        req.session.logado = true;
        const data = new Date();
        res.cookie("ultimaLogin", data.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30,});
        res.redirect("/");
    } else {
        res.redirect("/login");
        res.send(`
        <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Login</title>
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
         
     </head>
     <body>
    
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
     </body>
     </html>
        `); 
        res.end();   
    }
});
 

 
 function verautc(req, res, next){
     if(req.session.logado){
         next();
     } else {
         res.redirect("/login");
     }
 }

app.get("/", verautc, (req, res) => {
    const ultimaLogin = req.cookies.ultimaLogin;
    res.send(`  
<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Login</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
       
   </head>
   <body>
       
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
   </body>
   </html>
    `);
    res.end();
});



app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
});

const servidor = http.createServer(app);
servidor.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});