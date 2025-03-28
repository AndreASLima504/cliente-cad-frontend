import axios from "axios"
import 'regenerator-runtime/runtime'

let table
const url = "http://localhost:8080/cliente" 

// Executa quando carrega página
$(document).ready(async function (){
    loadTable()
})
    

// Função corresponde ao botão verde salvar na tela de gestão
$('#btnSalvar').click(async function(){
    var dados = {
        id: $('#txtId').val(),
        nome: $('#txtNome').val(),
        cpf: $('#txtCpf').val(),
        data_nascimento: $('#txtDataNasc').val(),
        endereco: $('#txtEndereco').val()
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
            alert("Cliente cadastrado com sucesso!")
            reloadTable()
        })
    } catch (error) {
        alert(error.response.data);
    }
}

// Faz o método put e trata a resposta
async function atualizar(dados) {
    try {
        await axios.put(url+`/${dados['id']}`, dados).then(function(response){
            alert("Cliente atualizado com sucesso!")
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
        table.clear().rows.add(response.data).draw();
    } catch (error) {
        alert("Erro ao atualizar a tabela: " + error);
    }
}


// Monta a datatable pela primeira vez na tela
async function loadTable(){
    await axios(url).then(function(response){
        table = $('#tabelaLista').DataTable({
            data: response.data,
            columnDefs:[
                {title: "Id", targets: 0},
                {title: "Nome", targets: 1},
                {title: "CPF", targets: 2},
                {title: "Data de nascimento", targets: 3},
                {title: "Endereço", targets: 4},
                {title: "Opções", targets: -1},
                
            ],
            columns: [
                { data: "id" },
                { data: "nome" },
                { data: "cpf" },
                { data: "data_nascimento" },
                {data: "endereco"},
                {data: null,            // Aqui, são criados os dois botões "editar" e "excluir" em html para exclusão e edição do respectivo cliente
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
    $("#txtNome").val('')
    $("#txtCpf").val('')
    $("#txtDataNasc").val('')
    $("#txtEndereco").val('')
})

// Aciona ao clicar nos botões "editar" da tabela, copiando dados da linha em questão para os campos
$('#tabelaLista').on('click', '.editar', async function () {
    var row = table.row($(this).parents('tr'));
    var rowData = row.data()
    $("#txtId").val(rowData['id'])
    $("#txtNome").val(rowData['nome'])
    $("#txtCpf").val(rowData['cpf'])
    $("#txtDataNasc").val(rowData['data_nascimento'])
    $("#txtEndereco").val(rowData['endereco'])

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