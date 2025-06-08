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

function verautc(req, res, next){
    if(req.session.logado){
        next();
    } else {
        res.redirect("/login");
    }
}

app.get("/", (req, res) => {
    
    res.send(`  
<!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Home</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
       <style>
        
       .container{
        display: block;
        align-items: center;
        background-color: white;
        padding: 20px;
        margin-top: 100px;
        border-radius: 10px;
        border-color: #6a0dad;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        color: black;
        text-align: left;
        width: fit-content;   
    }
    .container p{
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        font-size: 20px;
    }
       
       </style>
   </head>
   <body>

            <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Menu</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                    <a class="nav-link active" href="/login">Login</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/logout">Logout</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="/cadproduto">Cadastro de Produtos</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link active" href="/listaproduto">Lista de Produtos</a>
                    </li>
                    <p class="nav-link">${req.cookies.ultimoLogin?"Ultimo Login: "+req.cookies.ultimoLogin:""} </p>

                </ul>
                </div>
            </div>
            </nav>

       
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
   </body>
   </html>
    `);
    res.end();
});

app.get("/login", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Login</title>
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
     <style>
     body{
        background-color: grey;
     }

     .pagina {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        padding: 1rem;
        box-sizing: border-box;
    }
    
    .form-box {
        width: 100%;
        max-width: 700px;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 4rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background: #fff;
    }
    .btn-primary {
        background-color: #6a0dad !important;
        border-color: #6a0dad !important;
    }
    .btn-primary:hover {
        background-color: #5a0a9a !important;
        border-color: #5a0a9a !important;
    }
     
     </style>
    </head>
                <div class="pagina">
                <div class="form-box">
                <form method="POST" action="" class="needs-validation" novalidate>
                    <h1 style="text-align: center;">Login</h1>
                    <div class="mb-3 position-relative">
                    <label for="nomeLogin" class="form-label">Nome</label>
                    <input type="text" class="form-control" id="nomeLogin" name="usuario" required>
                    
                    </div>
            
                    <div class="mb-3 position-relative">
                    <label for="senhaLogin" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senhaLogin" name="senha" required>
                    
                    </div>
            
                    <button class="btn btn-primary w-100" type="submit">Entrar</button>
                </form>
                </div>
                </div>
  
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
        res.cookie("ultimoLogin", data.toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30,});
        res.cookie("usuario", usuario, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        res.redirect("/");
    } else {
        
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Login</title>
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
         <style>
         body{
            background-color: grey;
         }
    
         .pagina {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 1rem;
            box-sizing: border-box;
        }
        
        .form-box {
            width: 100%;
            max-width: 700px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 4rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background: #fff;
        }
        .btn-primary {
            background-color: #6a0dad !important;
            border-color: #6a0dad !important;
        }
        .btn-primary:hover {
            background-color: #5a0a9a !important;
            border-color: #5a0a9a !important;
        }
         
         </style>
        </head>
                    <div class="pagina">
                    <div class="form-box">
                    <form method="POST" action="" class="needs-validation" novalidate>
                        <h1 style="text-align: center;">Login</h1>
                        <div class="mb-3 position-relative">
                        <label for="nomeLogin" class="form-label">Nome</label>
                        <input type="text" class="form-control" id="nomeLogin" name="usuario" required>
                        
                        </div>
                
                        <div class="mb-3 position-relative">
                        <label for="senhaLogin" class="form-label">Senha</label>
                        <input type="password" class="form-control" id="senhaLogin" name="senha" required>
                        
                        </div>
                        <div>
                        <span style="color: red;">Usuário ou senha inválidos.</span>
                        </div>
                        <button class="btn btn-primary w-100" type="submit">Entrar</button>
                    </form>
                    </div>
                    </div>
      
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
        </body>
        </html>`
         ); 
        res.end();   
    }
});

app.get("/cadproduto", verautc, (req,res)=>{
    res.send(`
    <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Cadastro de Produtos</title>
         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
         <style>
         body{
            background-color: grey;
         }
    
         .pagina {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 1rem;
            box-sizing: border-box;
        }
        
        .form-box {
            width: 100%;
            max-width: 900px;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 4rem;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background: #fff;
        }
        .btn-primary {
            margin-right: 10px;
            background-color: #6a0dad !important;
            border-color: #6a0dad !important;
        }
        .btn-primary:hover {
            background-color: #5a0a9a !important;
            border-color: #5a0a9a !important;
        }
         </style>
     </head>
     <body>
          <div class="pagina">
          <div class="form-box">
                <form method="POST" action="/cadproduto" class="row g-3 needs-validation" novalidate>
                <h1 style="text-align: center;">Cadastro de Produtos</h1>
                <div class="col-md-12 position-relative">
                    <label for="codigoBarras" class="form-label">Código de barras</label>
                    <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>    
                </div>
                
                <div class="col-md-6 position-relative">
                    <label for="precoCusto" class="form-label">Preço de custo</label>
                    <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>   
                </div>
                
                <div class="col-md-6 position-relative">
                    <label for="precoVenda" class="form-label">Preço de venda</label>
                    <input type="number" step="0.01" class="form-control" name="precoVenda" id="precoVenda" required>
                </div>
                
                <div class="col-md-6 position-relative">
                    <label for="dataValidade" class="form-label">Data de validade</label>
                    <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                </div>
                
                <div class="col-md-6 position-relative">
                    <label for="qtdEstoque" class="form-label">Quantidade em estoque</label>
                    <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required>
                </div>
                
                <div class="col-md-12 position-relative">
                    <label for="nomeFabricante" class="form-label">Nome do fabricante</label>
                    <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required>
                </div>

                <div class="col-12 position-relative">
                    <label for="descricaoProduto" class="form-label">Descrição do produto</label>
                    <textarea class="form-control" id="descricaoProduto" name="descricaoProduto" rows="5" required></textarea>
                </div>
                
                <div class="col-12 d-flex" >
                    <button class="btn btn-primary w-100" type="submit">Cadastrar</button>
                    <a href="/" class="btn btn-secondary">Voltar ao Início</a>
                </div>
                </form>
          </div>
          </div>
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
     </body>
     </html>
    `);
    res.end();
});

app.post("/cadproduto", verautc, (req, res) => {
    const codigoBarras = req.body.codigoBarras;
    const descricaoProduto = req.body.descricaoProduto;
    const precoCusto = req.body.precoCusto;
    const precoVenda = req.body.precoVenda;
    const dataValidade = req.body.dataValidade;
    const qtdEstoque = req.body.qtdEstoque;
    const nomeFabricante = req.body.nomeFabricante;

    if(codigoBarras && descricaoProduto && precoCusto && precoVenda && dataValidade && qtdEstoque && nomeFabricante) {
        listaProdutos.push({
            codigoBarras: codigoBarras,
            descricaoProduto: descricaoProduto,
            precoCusto: precoCusto,
            precoVenda: precoVenda,
            dataValidade: dataValidade,
            qtdEstoque: qtdEstoque,
            nomeFabricante: nomeFabricante
        })
        res.redirect("/listaproduto");
    }else{
        let conteudo = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Produtos</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
            <style>
            body{
               background-color: grey;
            }
       
            .pagina {
               display: flex;
               justify-content: center;
               align-items: center;
               height: 100vh;
               padding: 1rem;
               box-sizing: border-box;
           }
           
           .form-box {
               width: 100%;
               max-width: 900px;
               border: 1px solid #ccc;
               border-radius: 10px;
               padding: 4rem;
               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
               background: #fff;
           }
           .btn-primary {
               background-color: #6a0dad !important;
               border-color: #6a0dad !important;
               margin-right: 10px;
           }
           .btn-primary:hover {
               background-color: #5a0a9a !important;
               border-color: #5a0a9a !important;
           }
           .erro{
               color: red;
           }
            </style>
        </head>
        <body>
             <div class="pagina">
             <div class="form-box">
                   <form method="POST" action="/cadproduto" class="row g-3">
                   <h1 style="text-align: center;">Cadastro de Produtos</h1>
        `;
        if(!codigoBarras){
            conteudo += `
            <div class="col-md-12 position-relative">
                <label for="codigoBarras" class="form-label">Código de barras</label>
                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
                <span class="erro">Por favor, insira o código de barras.</span>    
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-12 position-relative">
                <label for="codigoBarras" class="form-label">Código de barras</label>
                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" required>
            </div>
            `;
        }
        if(!precoCusto){
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="precoCusto" class="form-label">Preço de custo</label>
                <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
                <span class="erro">Por favor, insira o preço de custo.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="precoCusto" class="form-label">Preço de custo</label>
                <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" required>
            </div>
            `;
        }
        if(!precoVenda){
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="precoVenda" class="form-label">Preço de venda</label>
                <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" required>
                <span class="erro">Por favor, insira o preço de venda.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="precoVenda" class="form-label">Preço de venda</label>
                <input type="number" step="0.01" class="form-control" name="precoVenda" id="precoVenda" required>
            </div>
            `;
        }
        if(!dataValidade){
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="dataValidade" class="form-label">Data de validade</label>
                <input type="date" class="form-control" id="dataValidade" name="dataValidade" required>
                <span class="erro">Por favor, insira a data de validade.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="dataValidade" class="form-label">Data de validade</label>
                <input type="date" class="form-control" name="dataValidade" id="dataValidade" required>
            </div>
            `;
        }
        if(!qtdEstoque){
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="qtdEstoque" class="form-label">Quantidade em estoque</label>
                <input type="number" class="form-control" id="qtdEstoque" name="qtdEstoque" required>
                <span class="erro">Por favor, insira a quantidade em estoque.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-6 position-relative">
                <label for="qtdEstoque" class="form-label">Quantidade em estoque</label>
                <input type="number" class="form-control" name="qtdEstoque" id="qtdEstoque" required>
            </div>
            `;
        }
        if(!nomeFabricante){
            conteudo += `
            <div class="col-md-12 position-relative">
                <label for="nomeFabricante" class="form-label">Nome do fabricante</label>
                <input type="text" class="form-control" id="nomeFabricante" name="nomeFabricante" required>
                <span class="erro">Por favor, insira o nome do fabricante.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-md-12 position-relative">
                <label for="nomeFabricante" class="form-label">Nome do fabricante</label>
                <input type="text" class="form-control" name="nomeFabricante" id="nomeFabricante" required>
            </div>
            `;
        }
        if(!descricaoProduto){
            conteudo += `
            <div class="col-12 position-relative">
                <label for="descricaoProduto" class="form-label">Descrição do produto</label>
                <textarea class="form-control" id="descricaoProduto" name="descricaoProduto" required></textarea>
                <span class="erro">Por favor, insira a descrição do produto.</span>
            </div>
            `;
        }else{
            conteudo += `
            <div class="col-12 position-relative">
                <label for="descricaoProduto" class="form-label">Descrição do produto</label>
                <textarea class="form-control" name="descricaoProduto" id="descricaoProduto" rows="5" required></textarea>
            </div>
            `;
        }

        conteudo+=`
        <div class="col-12 d-flex " >
        <button class="btn btn-primary w-100" type="submit">Cadastrar</button>
        <a href="/" class="btn btn-secondary">Voltar ao Início</a>
        </div>
        </form>
    </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
    </body>
    </html>  
        `;

        res.send(conteudo);
        res.end();
        
    }
});

app.get("/listaproduto",verautc,(req,res)=>{
    const ultimoLogin = req.cookies.ultimoLogin;
    const usuario = req.cookies.usuario;
  let conteudo = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
      <style>
      body{
        background-color: grey;
        padding: 20px;
     }
     
    .table-container {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .custom-table td, .custom-table th {
        border-right: 1px solid #dee2e6 !important;
    }
    .custom-table td:last-child, .custom-table th:last-child {
        border-right: none !important;
    }
    .btn-primary {
        background-color: #6a0dad !important;
        border-color: #6a0dad !important;
        margin-right: 10px;
    }
    .btn-primary:hover {
        background-color: #5a0a9a !important;
        border-color: #5a0a9a !important;
    }
    
    
    .container{
        display: block;
        align-items: left;
        background-color: white;
        padding: 5px;
        margin-bottom: 20px;
        border-radius: 10px;
        border-color: #6a0dad;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        color: black;
        text-align: left;
        width: fit-content;   
    }
    .container p{
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        font-size: 20px;
    }
      </style>
  </head>
  <body>
    <div class="container">
    <p>${usuario?"Usuario: "+usuario:""}</p>
     <p>${ultimoLogin?"Ultimo Login: "+ultimoLogin:""}</p>
    </div>
    <div class="table-container">
    <table class="table table-striped table-bordered custom-table">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Codigo de Barras</th>
            <th scope="col">Preço de Custo</th>
            <th scope="col">Preço de Venda</th>
            <th scope="col">Data de Validade</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Fabricante</th>
            <th scope="col">Descrição</th>
          </tr>
        </thead>
        <tbody>
        <h1 style="text-align: center;">Produtos Cadastrados</h1>`;

        for(let i=0; i<listaProdutos.length;i++){
            conteudo += `
            <tr>
                <th scope="row">${i+1}</th>
                <td>${listaProdutos[i].codigoBarras}</td>
                <td>R$ ${Number(listaProdutos[i].precoCusto).toFixed(2)}</td>
                <td>R$ ${Number(listaProdutos[i].precoVenda).toFixed(2)}</td>
                <td>${listaProdutos[i].dataValidade}</td>
                <td>${listaProdutos[i].qtdEstoque}</td>
                <td>${listaProdutos[i].nomeFabricante}</td>
                <td>${listaProdutos[i].descricaoProduto.length > 50 ? listaProdutos[i].descricaoProduto.substring(0, 16) + '...' : listaProdutos[i].descricaoProduto}
               </td>
            </tr>`
        }
        conteudo +=`
        </tbody>
    </table>
    <div class="d-flex mt-4">
    <a href="/cadproduto" class="btn btn-primary">Cadastrar Novo Produto</a>
    <a href="/" class="btn btn-secondary">Voltar ao Início</a>
</div>
    </div>
      
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
  </body>
  </html>
  `;
  res.send(conteudo);
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