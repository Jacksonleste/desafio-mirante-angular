import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { faixaValidaValidator } from './filtro-lotes.validators';
import { FiltroLotePesquisa, SituacaoLote } from '../../../../core/models/lote.model';
import { Fluid } from "primeng/fluid";

@Component({
  selector: 'app-filtro-lotes',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, PanelModule, InputTextModule,
    SelectModule, InputNumberModule, DatePickerModule, ButtonModule,
    Fluid
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filtro-lotes.component.html',
})
export class FiltroLotesComponent {
  private readonly fb = inject(FormBuilder);

  @Output() pesquisar = new EventEmitter<FiltroLotePesquisa>();

  readonly situacaoOptions: Array<SituacaoLote | 'Todas'> = [
    'Todas', SituacaoLote.Aberto, SituacaoLote.Enviado, SituacaoLote.Confirmado,
  ];

  readonly form = this.fb.nonNullable.group(
    {
      instituicaoResp: [''],
      instituicao: [''],
      situacaoLote: ['Todas' as SituacaoLote | 'Todas'],
      idLoteDe: [null as number | null],
      idLoteAte: [null as number | null],
      valorLoteDe: [null as number | null],
      valorLoteAte: [null as number | null],
      dataEntradaDe: [null as Date | null],
      dataEntradaAte: [null as Date | null],
    },
    { validators: [faixaValidaValidator] }
  );

  /**
   * Dispara a pesquisa de lotes com base nos critérios preenchidos no formulário.
   * Se o formulário estiver inválido, marca todos os campos como tocados para exibir mensagens de erro.
   * @returns - Retorna void. Emite o evento `pesquisar` com os critérios de pesquisa preenchidos no formulário.
   */
  onPesquisar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const filtro: FiltroLotePesquisa = {
      instituicaoResp: v.instituicaoResp || undefined,
      instituicao: v.instituicao || undefined,
      situacaoLote: v.situacaoLote,
      idLoteDe: v.idLoteDe ?? undefined,
      idLoteAte: v.idLoteAte ?? undefined,
      valorLoteDe: v.valorLoteDe ?? undefined,
      valorLoteAte: v.valorLoteAte ?? undefined,
      dataEntradaDe: v.dataEntradaDe ?? undefined,
      dataEntradaAte: v.dataEntradaAte ?? undefined,
    };

    this.pesquisar.emit(filtro);
  }

  /**
   * Limpa todos os campos do formulário de filtro de lotes, resetando seus valores para o estado inicial.
   * @returns - Retorna void. Reseta o formulário para seus valores iniciais.
   */
  onLimpar(): void {
    this.form.reset();
  }
}
