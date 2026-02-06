import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

    //Criando um objeto da classe HttpClient
    private http = inject(HttpClient);

    //Criando a estrutura do formulário da página
    formulario = new FormGroup({ //formulário
      nome : new FormControl(''), //campo 'nome'
      email : new FormControl(''), //campo 'email'
      telefone : new FormControl('') //campo 'telefone'
    });

    //Função para realizar o cadastro do cliente
    cadastrar() {

      //Fazendo uma requisição HTTP POST para a API
      this.http.post('http://localhost:8081/api/v1/clientes', this.formulario.value, { responseType: 'text' })
        .subscribe((mensagem) => { //Aguardando o retorno da requisição
            alert(mensagem); //Exibir a mensagem para o usuário
            this.formulario.reset(); //Limpar o formulário
        }); 
    }
  
}
