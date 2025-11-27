import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import {FormsModule} from '@angular/forms';


export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  perfil: string;
}

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, NgForOf],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
  standalone: true
})
export class Usuarios implements OnInit {


  usuarios: Usuario[] = [];
  usuario: Usuario = this.novoUsuario();
  private contadorId = 1;


  ngOnInit(): void {
    this.carregarUsuariosMock();
  }

  public salvarUsuario(): void {
    this.onSubmit();
  }

  private carregarUsuariosMock() {
    this.usuarios = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', perfil: 'ADMIN' },
      { id: 2, nome: 'Maria Souza', email: 'maria@email.com', perfil: 'USER' }
    ];
    this.contadorId = 3;
  }


  onSubmit() {
    if (!this.validarFormulario()) return;


    if (this.usuario.id) {
      const index = this.usuarios.findIndex(u => u.id === this.usuario.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuario };
        alert('Usuário atualizado com sucesso!');
      }
    } else {
      this.usuario.id = this.contadorId++;
      this.usuarios.push({ ...this.usuario });
      alert('Usuário criado com sucesso!');
    }


    this.resetarFormulario();
  }


  editarUsuario(user: Usuario) {
    this.usuario = { ...user };
  }


  deletarUsuario(id?: number) {
    if (!id) return;


    if (confirm('Deseja realmente remover este usuário?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      alert('Usuário removido com sucesso!');
    }
  }


  private validarFormulario(): boolean {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.perfil) {
      alert('Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  }


  private novoUsuario(): Usuario {
    return {
      nome: '',
      email: '',
      perfil: ''
    };
  }


  protected resetarFormulario() {
    this.usuario = this.novoUsuario();
  }


}
