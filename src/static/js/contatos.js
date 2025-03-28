import axios from "axios"
import 'regenerator-runtime/runtime'

let table
const url = "http://127.0.0.1:8080/contato" 

$(document).ready(async function(){
    loadTable()
    carregarSelect()

})


async function carregarSelect(){
    var clientes = await axios("http://localhost:8080/cliente")
    var select = $("#selectCliente")
    clientes.data.forEach(cli => {
        var option = document.createElement('option')
        option.value = cli['id']
        option.innerHTML = cli['nome']
        select.append(option)
    });
}


$('#btnSalvar').click(async function(){
    // Objeto enviado como Json para API (chaves devem ser idênticas as recebidas no backend)
    var dados = {
        id: $('#txtId').val(),
        cliente_id: $('#selectCliente').val(),
        tipo_contato: $('#txtTipoContato').val(),
        valor: $('#txtValor').val(),
        observacao: $('#txtObservacao').val()
    }
    console.log(dados)
    if(dados['id'] == ""){
        await cadastrar(dados)
    }else{
        await atualizar(dados)
    }
    reloadTable()
})

async function cadastrar(dados){
    try {
        await axios.post(url, dados).then(function(response){
            alert("Contato cadastrado com sucesso!")
            console.log(response.data)
        })
    } catch (error) {
        alert(error);
    }
}

async function atualizar(dados) {
    try {
        await axios.put(url+`/${dados['id']}`, dados).then(function(response){
            alert("Usuário atualizado com sucesso!")
            reloadTable()
        })
    } catch (error) {
        alert(error);
    }
}

async function reloadTable(){
    try {
        const response = await axios(url);
        table.clear().rows.add(formatarDadosResposta(response.data)).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error);
    }
}

function formatarDadosResposta(resposta){
    // console.log(resposta)
    var arrayDados = []
    resposta.forEach(i => {
        var respostaForm = {
            id: i.id,
            nome_cliente: i.cliente.nome,
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
            data: formatarDadosResposta(response.data),
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome cliente", targets: 1},
                {title: "Tipo de Contato", targets: 2},
                {title: "Contato", targets: 3},
                {title: "Observação", targets: 4},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "nome_cliente" },
                { data: "tipo_contato" },
                { data: "valor" },
                {data: "observacao"},
                {data: null,
                    defaultContent: '<button class="editar">Editar</button>&nbsp;<button class="excluir">Excluir</button>',
                    targets: -1},
            ],
        })
        
    }).catch(function (error){
        alert(error)
    })
}

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

$('#tabelaLista').on('click', '.excluir', async function () {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    try {
        await axios.delete(url + `/${rowData['id']}`).then(function (response){
            alert(response.data)
        })
        reloadTable()
    } catch (error) {
        alert(error)
    }
});