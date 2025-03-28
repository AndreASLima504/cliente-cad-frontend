import axios from "axios"
import 'regenerator-runtime/runtime'

let table
const url = "http://127.0.0.1:8080/contato" 


// Executa quando carrega página
$(document).ready(async function(){
    loadTable()
    carregarSelect()

})

// Faz requisição get dos clientes e adiciona todos no select
async function carregarSelect(){
    var clientes = await axios("http://localhost:8080/cliente")
    var select = $("#selectCliente")
    clientes.data.forEach(cli => {
        var option = document.createElement('option')
        // Note que o valor inserido nas opções é o id, mas o texto é o nome e o cpf para identificação
        option.value = cli['id']

        option.innerHTML = `${cli['nome']} (${cli['cpf']})`
        select.append(option)
    });
}


// Função corresponde ao botão verde salvar na tela de gestão
$('#btnSalvar').click(async function(){
    // Objeto enviado como Json para API (chaves devem ser idênticas as recebidas no backend)
    var dados = {
        id: $('#txtId').val(),
        cliente_id: $('#selectCliente').val(),
        tipo_contato: $('#txtTipoContato').val(),
        valor: $('#txtValor').val(),
        observacao: $('#txtObservacao').val()
    }

    // Se não for passado nenhum id, faz o cadastro dos dados, caso passe, envia para atualização
    if(dados['id'] == ""){
        await cadastrar(dados)
    }else{
        await atualizar(dados)
    }
    reloadTable()
})

// Faz o método post e trata a resposta
async function cadastrar(dados){
    try {
        await axios.post(url, dados).then(function(response){
            alert("Contato cadastrado com sucesso!")
            console.log(response.data)
        })
    } catch (error) {
        alert(error.response.data);
    }
}

// Faz o método put e trata a resposta
async function atualizar(dados) {
    try {
        await axios.put(url+`/${dados['id']}`, dados).then(function(response){
            alert("Usuário atualizado com sucesso!")
            reloadTable()
        })
    } catch (error) {
        alert(error.response.data);
    }
}

// Atualiza a tabela com os dados
async function reloadTable(){
    try {
        const response = await axios(url);
        table.clear().rows.add(formatarDadosResposta(response.data)).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error.response.data);
    }
}


// Função necessária para formatar os dados resposta da requisição para exibição correta
function formatarDadosResposta(resposta){
    // console.log(resposta)
    var arrayDados = []
    resposta.forEach(i => {
        var respostaForm = {
            id: i.id,

            // Resposta originalmente continha apenas objeto cliente
            nome_cliente: i.cliente.nome,
            cpf_cliente: i.cliente.cpf,

            tipo_contato: i.tipo_contato,
            valor: i.valor,
            observacao: i.observacao
        }
        arrayDados.push(respostaForm)
    })
    return arrayDados
}

async function loadTable(){
    await axios(url).then(function(response){
        table = $('#tabelaLista').DataTable({
            // Utiliza dados formatados para estruturação da tabela
            data: formatarDadosResposta(response.data),
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome cliente", targets: 1},
                {title: "CPF cliente", targets: 2},
                {title: "Tipo de Contato", targets: 3},
                {title: "Contato", targets: 4},
                {title: "Observação", targets: 5},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "nome_cliente" },
                { data: "cpf_cliente" },
                { data: "tipo_contato" },
                { data: "valor" },
                {data: "observacao"},
                {data: null,
                    defaultContent: '<button class="editar">Editar</button>&nbsp;<button class="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        alert(error.response.data)
    })
}

// Botão vermelho de limpar na tela de gestão. Limpa os campos.
$('#btnLimpar').click(async function(){
    $("#txtId").val('')
    $("#txtTipoContato").val('')
    $("#txtValor").val('')
    $("#txtObservacao").val('')
})

// Aciona ao clicar nos botões "editar" da tabela, copiando dados para os campos
$('#tabelaLista').on('click', '.editar', async function () {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    $("#txtId").val(rowData['id'])
    $("#selectCliente").val(rowData['cliente_nome'])
    $("#txtTipoContato").val(rowData['tipo_contato'])
    $("#txtValor").val(rowData['valor'])
    $("#txtObservacao").val(rowData['observacao'])

});

// Função que é chamada quando o botão excluir é chamado, enviando uma requisição delete com o id da tupla selecionada
$('#tabelaLista').on('click', '.excluir', async function () {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    try {
        await axios.delete(url + `/${rowData['id']}`).then(function (response){
            alert(response.data)
        })
        reloadTable()
    } catch (error) {
        alert(error.response.data)
    }
});