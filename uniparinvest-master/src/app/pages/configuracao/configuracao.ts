import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Acao} from "../tickers/acao.model";
import {Configuracao, ConfiguracaoService} from "../../service/configuracao.service";
import {AcaoService} from "../../service/acao.service";

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgForOf],
  templateUrl: './configuracao.html',
  styleUrl: './configuracao.css'
})
export class ConfiguracaoComponent implements OnInit {
  acoes: Acao[] = [];
  selecionadas: Acao[] = [];
  intervaloAtualizacaoMs = 5000;

  constructor(
    private acoesService: AcaoService,
    private configuracaoService: ConfiguracaoService
  ) {}

  ngOnInit(): void {
    this.buscarAcoes();
  }

  buscarAcoes(): void {
    this.acoesService.getAll().subscribe({
      next: (res) => (this.acoes = res),
      error: () => alert('Erro ao buscar ações'),
    });
  }

  isSelecionada(acao: Acao): boolean {
    return this.selecionadas.some(a => a.id === acao.id);
  }

  toggleSelecao(acao: Acao): void {
    const index = this.selecionadas.findIndex((a) => a.id === acao.id);
    if (index >= 0) {
      this.selecionadas.splice(index, 1);
    } else {
      this.selecionadas.push(acao);
    }
  }

  salvarConfiguracao(): void {
    const config: Configuracao = {
      acoesSelecionadas: this.selecionadas,
      intervaloAtualizacaoMs: this.intervaloAtualizacaoMs,
    };

    this.configuracaoService.create(config).subscribe({
      next: () => alert('Configuração salva com sucesso!'),
      error: () => alert('Erro ao salvar configuração'),
    });
  }
}
