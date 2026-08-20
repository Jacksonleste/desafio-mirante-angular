import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-barra-acoes-lote',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './barra-acoes-lote.component.html',
})
export class BarraAcoesLoteComponent {
  @Input() podeIncluir = false;
  @Input() podeAlterar = false;
  @Input() podeExcluir = false;
  @Input() podeVisualizar = false;


  @Output() confirmar = new EventEmitter<void>();
  @Output() enviar = new EventEmitter<void>();
  @Output() visualizarJustificativa = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<void>();
  @Output() alterar = new EventEmitter<void>();
  @Output() excluir = new EventEmitter<void>();
  @Output() visualizar = new EventEmitter<void>();
}
