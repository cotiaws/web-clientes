import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

    //Criando um objeto da classe HttpClient
    private http = inject(HttpClient);

    //Atributo para guardar o endereço da API
    private apiUrl = 'http://localhost:8081/api/v1/clientes';

    //Atributo para armazenar os dados da consulta de clientes
    clientes = signal<any[]>([]);

    //Atributo para guardar os dados do cliente que será alterado
    cliente = signal<any | null>(null); //Valor inicial null (vazio)

    //Criando a estrutura do formulário de cadastro
    formCadastroEdicao = new FormGroup({ //formulário
      nome : new FormControl(''), //campo 'nome'
      email : new FormControl(''), //campo 'email'
      telefone : new FormControl('') //campo 'telefone'
    });

    //Criando a estrutura do formulário de consulta
    formConsulta = new FormGroup({
      nome : new FormControl('') //campo 'nome' para consulta
    });

    //Função para realizar o cadastro do cliente
    salvar() {

      //Verificando se nenhum cliente foi selecionado para edição
      if(this.cliente() == null) { //CADASTRAR o cliente
            //Fazendo uma requisição HTTP POST para a API
            this.http.post(this.apiUrl, this.formCadastroEdicao.value, { responseType: 'text' })
              .subscribe((mensagem) => { //Aguardando o retorno da requisição
                  alert(mensagem); //Exibir a mensagem para o usuário
                  this.formCadastroEdicao.reset(); //Limpar o formulário
              }); 
      }
      else {
          //Fazendo a requisição HTTP PUT para a API
          this.http.put(this.apiUrl + "/" + this.cliente().id, this.formCadastroEdicao.value, 
            { responseType: 'text' })
            .subscribe((mensagem) => {
              alert(mensagem); //Exibir a mensagem para o usuário
              this.formCadastroEdicao.reset(); //limpar o formulário
              this.consultar(); //fazendo uma nova consulta
              this.cliente.set(null); //Voltar para a opção de cadastro
            });
      }
    }

    //Função para realizar a consulta de clientes
    consultar() {

      //Fazendo uma requisição HTTP GET para a API
      this.http.get(this.apiUrl + '/' + this.formConsulta.value.nome)
        .subscribe((clientes) => { //Aguardando o retorno da requisição
          this.clientes.set(clientes as any[]); //Atualizar o sinal com os dados dos clientes
        });
    }  

    //Função para realizar a exclusão de clientes
    excluir(id: number) {

      //Verificar se o usuário deseja excluir o cliente
      var confirmacao = window.confirm('Deseja realmente excluir este cliente?');
      if( ! confirmacao)
          return; //Cancelar a operação
      
      //Fazendo uma requisição HTTP DELETE para a API
      this.http.delete(this.apiUrl + "/" + id, { responseType: 'text' })
        .subscribe((mensagem) => {
          alert(mensagem); //Exibindo a mensagem obtida
          this.consultar(); //Executando uma nova consulta
        });        
    }

    editar(cliente: any) {
      //Armazenar os dados do cliente no atributo da classe
      this.cliente.set(cliente);
      //Preencher os campos do formulário com 
      //os dados do cliente selecionado para edição
      this.formCadastroEdicao.patchValue(cliente);
    }
}
