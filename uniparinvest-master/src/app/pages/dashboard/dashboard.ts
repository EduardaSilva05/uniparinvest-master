import { Component, OnDestroy, OnInit } from '@angular/core';
import {AcaoDashboard, DashboardService} from '../../service/dashboard.service';
import {ConfiguracaoService} from '../../service/configuracao.service';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {Acao} from '../tickers/acao.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dados: AcaoDashboard[] = [];
  configId = 1;
  intervaloMs = 5000;
  timer: any;

  constructor(
    private dashboardService: DashboardService,
    private configuracaoService: ConfiguracaoService
  ) {}

  ngOnInit(): void {
    this.configuracaoService.getById(this.configId).subscribe({
      next: (config) => {
        this.intervaloMs = config.intervaloAtualizacaoMs;
        this.buscarDados();
        this.timer = setInterval(() => this.buscarDados(), this.intervaloMs);
      },
      error: () => alert('Erro ao carregar configuração'),
    });
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  buscarDados(): void {
    console.log('Buscando dados do dashboard...');
    this.dashboardService.getDashboard(this.configId).subscribe({
      next: (res) => {
        console.log('Retorno do backend:', res);
        this.dados = res;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        alert('Erro ao carregar dados do dashboard');
      },
    });
  }

}
