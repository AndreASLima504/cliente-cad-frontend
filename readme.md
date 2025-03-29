# Projeto Cliente-Cad, um sistema de gerenciamento de contatos e clientes
#### *Este projeto é dependente do módulo backend disponível em: https://github.com/AndreASLima504/client-cad-api*


## Dependências:
### Backend:
- **JDK 21**
- **Docker Desktop**
- **Maven 2**
  - Spring Boot Starter Data JPA 3.4.4
  - Spring Boot Starter Web 3.4.4
  - Mysql Connector J 8.2.0
  - Spring Boot Configuration Processor 3.4.4
  - Apache HTTP Client 5

### Frontend:
(usando **Yarn** como gerenciador de pacotes)
- Axios
- DataTables
- Parcel
  
*(Usar as versões mais recentes dos pacotes.)*

---

## Configurando o projeto

### Backend
1. Abra a pasta raiz do backend e sincronize as dependências do arquivo `pom.xml` com Maven.
2. No terminal, execute o comando:
   ```sh
   docker compose up
   ```
   Isso fará com que o Docker construa e execute automaticamente uma imagem MySQL, expondo o servidor MySQL na porta **3306**.
3. As configurações do banco de dados estão definidas no arquivo `docker-compose.yml`. **IMPORTANTE**: Os atributos `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password` no arquivo `src/main/resources/application.properties` devem corresponder às informações do `docker-compose.yml`.
4. Para população e criação do banco de dados, execute o script disponibilizado na raiz do projeto. **Utilize a senha 'root' para conectar se ao servidor** (observação: a API cria as tabelas no banco de dados automaticamente, porém ela não executa sem que o banco AGENDA exista)
5. Sincronize as dependências Maven e execute o programa Java.

### Frontend
1. No terminal, dentro da pasta raiz do frontend, execute o comando:
   ```sh
   yarn
   ```
   Isso instalará automaticamente as dependências do arquivo `package.json`.
2. Para iniciar o servidor, execute:
   ```sh
   yarn parcel src/index.html
   ```
3. O servidor estará rodando em **https://localhost:1234/index.html**.

---

## Como Utilizar o Sistema

### Gerenciamento de Clientes
1. Clique em **"Gerenciar Clientes"**.
2. Aparecerá um bloco com campos de texto e uma tabela onde o sistema listará automaticamente todos os clientes cadastrados.

#### Cadastro
- Para cadastrar um novo cliente, preencha todos os dados, **exceto o ID** (este campo é usado apenas para edição).
- Clique em **"Salvar"**.
- Se tudo ocorrer corretamente, uma mensagem de sucesso será exibida.

#### Listagem
- Para encontrar um cliente, você pode percorrer a tabela manualmente ou utilizar o campo **"Search"** no topo esquerdo da tabela.
- Qualquer atributo do cliente pode ser usado como critério de busca.
- Os dados exibidos na listagem são: **Nome, CPF, Data de Nascimento e Endereço**.

#### Edição
- Localize o cliente na tabela e clique no botão **"Editar"** (localizado na última coluna da tabela).
- Os dados do cliente serão carregados nos campos de texto.
- Edite os dados conforme necessário, **exceto o ID**.
- Clique em **"Salvar"** e aguarde a confirmação de sucesso.

#### Exclusão
- Para excluir um cliente, clique no botão **"Excluir"** na linha correspondente ao cliente desejado.

### Gerenciamento de Contatos
1. Clique em **"Gerenciar Contatos"**.
2. Aparecerá um bloco com campos de texto e uma tabela onde o sistema listará automaticamente todos os contatos cadastrados dos clientes.
3. Os dados exibidos na tabela incluem:
   - Nome do Cliente
   - CPF
   - Tipo de Contato Cadastrado
   - Contato
   - Observação

O funcionamento da tela de contatos é virtualmente o mesmo que o da tela de clientes, com as diferenças descritas abaixo.

#### Cadastro
- Para cadastrar um novo contato, é **obrigatório** vincular um cliente.
- Isso é feito através de um **select** contendo os nomes e CPFs de todos os clientes cadastrados.
- Preencha os demais campos e clique em **"Salvar"**.

#### Listagem
- É possível buscar todos os contatos de um cliente específico utilizando seu **nome** ou **CPF** no campo **"Search"**.

---

## Observações
- Certifique-se de que o Docker Desktop esteja em execução antes de iniciar o backend.
- Caso precise modificar as credenciais do banco de dados, altere tanto o `docker-compose.yml` quanto o `application.properties` para garantir a compatibilidade.
- Se houver problemas na instalação do frontend, verifique se o **Yarn** está instalado corretamente.

---


