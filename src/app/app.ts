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

    //Criando a estrutura do formulário de cadastro
    formCadastro = new FormGroup({ //formulário
      nome : new FormControl(''), //campo 'nome'
      email : new FormControl(''), //campo 'email'
      telefone : new FormControl('') //campo 'telefone'
    });

    //Criando a estrutura do formulário de consulta
    formConsulta = new FormGroup({
      nome : new FormControl('') //campo 'nome' para consulta
    });

    //Função para realizar o cadastro do cliente
    cadastrar() {

      //Fazendo uma requisição HTTP POST para a API
      this.http.post(this.apiUrl, this.formCadastro.value, { responseType: 'text' })
        .subscribe((mensagem) => { //Aguardando o retorno da requisição
            alert(mensagem); //Exibir a mensagem para o usuário
            this.formCadastro.reset(); //Limpar o formulário
        }); 
    }

    //Função para realizar a consulta de clientes
    consultar() {

      //Fazendo uma requisição HTTP GET para a API
      this.http.get(this.apiUrl + '/' + this.formConsulta.value.nome)
        .subscribe((clientes) => { //Aguardando o retorno da requisição
          this.clientes.set(clientes as any[]); //Atualizar o sinal com os dados dos clientes
        });
    }  
}
