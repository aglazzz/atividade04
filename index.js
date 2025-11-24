import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta = 3000;
var listaProdutos = [];

const server = express();

server.use(session({
    secret:"manu123",
    resave: true, 
    saveUninitialized: true, 
    maxAge: 1000 * 60 * 15
    }
));

server.use(express.urlencoded({extended: true}));

server.use(cookieParser());

server.get("/", verificarUsuarioLogado, (requisicao, resposta) => {
    let ultimoAcesso = requisicao.cookies?.ultimoAcesso;

    const data = new Date();
    resposta.cookie("ultimoAcesso", data.toLocaleString());
    resposta.setHeader("Content-Type", "text/html");
    resposta.write(`
            <DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    <title>Menu do Sistema</title>
                </head>
                <body>
                    <div class="bg-primary text-white py-5 mb-4">
                        <div class="container">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <h1 class="display-4 fw-bold">Sistema de Produtos</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="container">
                        <div class="row mb-4">
                            <div class="col-12">
                                <div class="alert alert-info">
                                    <h4 class="alert-heading">Bem-vindo, ${requisicao.session.dadosLogin?.nome || 'Usuário'}!</h4>
                                    <p class="mb-0">Último acesso: ${ultimoAcesso || "Primeiro acesso"}</p>
                                </div>
                            </div>
                        </div>

                        <div class="row g-4">
                            <div class="col-md-6 col-lg-6">
                                <div class="card border-primary">
                                    <div class="card-body text-center p-4">
                                        <h5 class="card-title text-primary">📦 Cadastrar Produto</h5>
                                        <a href="/cadastroProduto" class="btn btn-primary w-100">Acessar</a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-6 col-lg-6">
                                <div class="card border-success">
                                    <div class="card-body text-center p-4">
                                        <h5 class="card-title text-success">📋 Listar Produtos</h5>
                                        <a href="/listarProdutos" class="btn btn-success w-100">Acessar</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                </body>
            </html>
        `);

        resposta.end();
});

server.get("/cadastroProduto", verificarUsuarioLogado, (requisicao, resposta) => {
    resposta.send(`
            <DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    <title>Cadastro de Produto</title>
                </head>
                <body>
                    <div class="container">
                        <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Produto</h1>
                        <form method="POST" action="/adicionarProduto" class="row g-3 needs-validation m-3 p-3 bg-light" novalidate>
                            <div class="col-md-6">
                                <label for="codigoBarras" class="form-label">Código de Barras</label>
                                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras">
                            </div>
                            <div class="col-md-6">
                                <label for="descricao" class="form-label">Descrição do Produto</label>
                                <input type="text" class="form-control" id="descricao" name="descricao">
                            </div>
                            <div class="col-md-4">
                                <label for="precoCusto" class="form-label">Preço de Custo</label>
                                <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto">
                            </div>
                            <div class="col-md-4">
                                <label for="precoVenda" class="form-label">Preço de Venda</label>
                                <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda">
                            </div>
                            <div class="col-md-4">
                                <label for="dataValidade" class="form-label">Data de Validade</label>
                                <input type="date" class="form-control" id="dataValidade" name="dataValidade">
                            </div>
                            <div class="col-md-6">
                                <label for="quantidadeEstoque" class="form-label">Quantidade em Estoque</label>
                                <input type="number" class="form-control" id="quantidadeEstoque" name="quantidadeEstoque">
                            </div>
                            <div class="col-md-6">
                                <label for="fabricante" class="form-label">Fabricante</label>
                                <input type="text" class="form-control" id="fabricante" name="fabricante">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                        </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>
        `);
});

server.post('/adicionarProduto', verificarUsuarioLogado, (requisicao, resposta) => {
    
    const codigoBarras = requisicao.body.codigoBarras;
    const descricao = requisicao.body.descricao;
    const precoCusto = requisicao.body.precoCusto;
    const precoVenda = requisicao.body.precoVenda;
    const dataValidade = requisicao.body.dataValidade;
    const quantidadeEstoque = requisicao.body.quantidadeEstoque;
    const fabricante = requisicao.body.fabricante;

    if(codigoBarras && descricao && precoCusto && precoVenda && dataValidade && quantidadeEstoque && fabricante){
        
        listaProdutos.push({codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidadeEstoque, fabricante});
        resposta.redirect("/listarProdutos");
    }else{
        let conteudo = `
            <DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    <title>Cadastro de Produto</title>
                </head>
                <body>
                    <div class="container">
                        <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Produto</h1>
                        <form method="POST" action="/adicionarProduto" class="row g-3 needs-validation m-3 p-3 bg-light" novalidate>
                            <div class="col-md-6">
                                <label for="codigoBarras" class="form-label">Código de Barras</label>
                                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="${codigoBarras}">
                        `;
        if(!codigoBarras){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o código de barras do produto.</p>
                </div>`;                    
        }

        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="descricao" class="form-label">Descrição do Produto</label>
                                <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}">
                            `;
        if(!descricao){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe a descrição do produto.</p>
                </div>`;  
        }
                       
        
        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="precoCusto" class="form-label">Preço de Custo</label>
                                <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}">
                            `;
        if(!precoCusto){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o preço de custo.</p>
                </div>`;
        }


        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="precoVenda" class="form-label">Preço de Venda</label>
                                <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}">
                            `;
        if(!precoVenda){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o preço de venda.</p>
                </div>`;
        }

        conteudo += `</div>
                            <div class="col-md-4">
                                <label for="dataValidade" class="form-label">Data de Validade</label>
                                <input type="date" class="form-control" id="dataValidade" name="dataValidade" value="${dataValidade}">
                            `;
        if(!dataValidade){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe a data de validade.</p>
                </div>`;
        }
        
        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="quantidadeEstoque" class="form-label">Quantidade em Estoque</label>
                                <input type="number" class="form-control" id="quantidadeEstoque" name="quantidadeEstoque" value="${quantidadeEstoque}">
                            `;
        if(!quantidadeEstoque){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe a quantidade em estoque.</p>
                </div>`;
        }

        conteudo += `</div>
                            <div class="col-md-6">
                                <label for="fabricante" class="form-label">Fabricante</label>
                                <input type="text" class="form-control" id="fabricante" name="fabricante" value="${fabricante}">
                            `;
        if(!fabricante){
            conteudo += `
                <div>
                    <p class="text-danger">Por favor, informe o fabricante.</p>
                </div>`;
        }

        conteudo += `</div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                        </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            </html>`;

        resposta.send(conteudo);
        
    }
});

server.get("/listarProdutos", verificarUsuarioLogado, (requisicao, resposta) => {
    let ultimoAcesso = requisicao.cookies?.ultimoAcesso;
    
    let conteudo = `
        <DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>Lista de Produtos no Sistema</title>
            </head>
            <body>
                <div class="container">
                    <h1 class="text-center border m-3 p-3 bg-light">Lista de Produtos</h1>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Código de Barras</th>
                                <th>Descrição</th>
                                <th>Preço Custo</th>
                                <th>Preço Venda</th>
                                <th>Data Validade</th>
                                <th>Qtd Estoque</th>
                                <th>Fabricante</th>
                            </tr>
                        </thead>
                        <tbody>`;
 
    for(let i = 0; i < listaProdutos.length; i++){
        conteudo += `
            <tr>
                <td>${listaProdutos[i].codigoBarras}</td>
                <td>${listaProdutos[i].descricao}</td>
                <td>R$ ${listaProdutos[i].precoCusto}</td>
                <td>R$ ${listaProdutos[i].precoVenda}</td>
                <td>${listaProdutos[i].dataValidade}</td>
                <td>${listaProdutos[i].quantidadeEstoque}</td>
                <td>${listaProdutos[i].fabricante}</td>
            </tr>
        `;
    }

    conteudo += `
                        </tbody>
                    </table>
                    <a class="btn btn-secondary m-3" href="/">Voltar</a>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
        </html>
    `;

    resposta.send(conteudo);
});

server.get("/login", (requisicao, resposta) => {
    resposta.send(`
            <!DOCTYPE html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container w-25">
                        <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                            <fieldset class="border p-2">
                                <legend class="mb-3">Autenticação do Sistema</legend>
                                <div class="col-md-4">
                                    <label for="" class="form-label">Usuário:</label>
                                    <input type="text" class="form-control" id="usuario" name="usuario" required>
                                </div>
                                <div class="col-md-4">
                                    <label for="senha" class="form-label">Senha</label>
                                    <input type="password" class="form-control" id="senha" name="senha" required>
                                </div>
                                <div class="col-12 mt-2">
                                    <button class="btn btn-primary" type="submit">Login</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                        crossorigin="anonymous"></script>
                </body>
            </html>       
        `)
});

server.post("/login", (requisicao, resposta) => {
    const {usuario, senha} = requisicao.body;

    if(usuario === "admin" && senha === "admin"){
    requisicao.session.dadosLogin = {
        nome: "Administrador",
        logado: true,
    }
        resposta.redirect("/");
    }else{
        resposta.write(`
                <!DOCTYPE html>
                    <head>
                        <meta charset="utf-8">
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                    </head>
                    <body>
                        <div class="container w-25">
                            <form action='/login' method='POST' class="row g-3 needs-validation" novalidate>
                                <fieldset class="border p-2">
                                    <legend class="mb-3">Autenticação do Sistema</legend>
                                    <div class="col-md-4">
                                        <label for="" class="form-label">Usuário:</label>
                                        <input type="text" class="form-control" id="usuario" name="usuario" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="senha" class="form-label">Senha</label>
                                        <input type="password" class="form-control" id="senha" name="senha" required>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <button class="btn btn-primary" type="submit">Login</button>
                                    </div>
                                </fieldset>
                            </form>
                            <div class="col-12 mt-2">
                                <p class="text-danger">Usuário ou senha inválidos!</p>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                            crossorigin="anonymous"></script>
                    </body>
                </html>              
            `)
    }
});

function verificarUsuarioLogado(requisicao, resposta, proximo){
    if(requisicao.session.dadosLogin?.logado){
        proximo();
    }else{
        resposta.redirect("/login");
    }
}

server.listen(porta, host, () => {
    console.log(`Servidor executando em http://${host}:${porta}`);
});