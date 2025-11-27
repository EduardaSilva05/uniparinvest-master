import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService, AcaoDashboard } from '../../service/dashboard.service';
import { ConfiguracaoService } from '../../service/configuracao.service';
import { UsuariosService } from '../../service/usuarios.service';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  usuarios: any[] = [];
  usuarioSelecionado: number | null = null;

  dados: AcaoDashboard[] = [];
  intervaloMs = 5000;
  timer: any;

  constructor(
    private dashboardService: DashboardService,
    private configuracaoService: ConfiguracaoService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  carregarUsuarios() {
    this.usuariosService.getAll().subscribe({
      next: (lista) => {
        this.usuarios = lista;

        if (this.usuarios.length > 0) {
          this.usuarioSelecionado = this.usuarios[0].id;
          this.trocarUsuario();
        }
      },
      error: () => alert('Erro ao carregar usuários')
    });
  }

  trocarUsuario() {
    if (!this.usuarioSelecionado) return;

    // Pega configuração do usuário escolhido
    this.configuracaoService.getByUsuario(this.usuarioSelecionado).subscribe({
      next: (config) => {
        this.intervaloMs = config.intervaloAtualizacaoMs;

        // Reinicia o timer
        if (this.timer) clearInterval(this.timer);

        this.buscarDados(config.id);
        this.timer = setInterval(() => this.buscarDados(config.id), this.intervaloMs);
      },
      error: () => alert('Erro ao carregar configuração do usuário')
    });
  }

  buscarDados(configId: number) {
    this.dashboardService.getDashboard(configId).subscribe({
      next: (res) => (this.dados = res),
      error: () => alert('Erro ao carregar dashboard')
    });
  }

  onUsuarioChange() {

  }
}
