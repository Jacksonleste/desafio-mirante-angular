import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ContaCorrenteService } from '../../../../core/services/conta-corrente.service';
import { Lancamento } from '../../../../core/models/lancamento.model';
import { contaLocalizadaValidator } from './incluir-lancamento.validators';
import { OpcoesFormularioService } from '../../../../core/services/opcoes.formulario.service';
import { Fluid } from 'primeng/fluid';

@Component({
  selector: 'app-incluir-lancamento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    Fluid,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incluir-lancamento.component.html',
})
export class IncluirLancamentoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contaCorrenteService = inject(ContaCorrenteService);
  private readonly opcoesService = inject(OpcoesFormularioService);

  @Input() visible = false;
  @Input({ required: true }) idLote!: number;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() lancamentoConfirmado = new EventEmitter<Omit<Lancamento, 'idLancamento'>>();

  readonly buscandoConta = signal(false);
  readonly contaNaoEncontrada = signal(false);

  readonly historicoOptions = signal<string[]>([]);
  readonly paOptions = signal<string[]>([]);

  readonly situacaoContaFixa = 'Pendente' as const;
  readonly situacaoCscFixa = 'Aguardando Processamento CCO' as const;

  readonly form = this.fb.nonNullable.group({
    contaCorrente: this.fb.nonNullable.group(
      {
        contaCorrente: ['', Validators.required],
        nomeTitular: [{ value: '', disabled: true }],
        valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
        historico: ['', Validators.required],
        estorno: [false],
        documento: ['', Validators.required],
        descricao: [''],
      },
      { validators: [contaLocalizadaValidator] },
    ),
    documentoCsc: this.fb.nonNullable.group({
      pa: ['', Validators.required],
      idEvento: [''],
      complHistorico: ['', Validators.required],
      idDocCsc: [''],
    }),
  });

  constructor() {
    this.opcoesService
      .listarHistoricos()
      .subscribe((valores) => this.historicoOptions.set(valores));
    this.opcoesService.listarPA().subscribe((valores) => this.paOptions.set(valores));
  }

  /**
   * Busca a conta corrente informada no formulário e atualiza o campo de nome do titular.
   * @returns - Retorna void. Se a conta for encontrada, o campo de nome do titular será preenchido; caso contrário, será exibida uma mensagem de erro.
   */
  buscarConta(): void {
    const grupo = this.form.controls.contaCorrente;
    const numero = grupo.controls.contaCorrente.value;
    if (!numero) return;

    this.buscandoConta.set(true);
    this.contaNaoEncontrada.set(false);

    this.contaCorrenteService.buscar(numero).subscribe((conta) => {
      this.buscandoConta.set(false);
      if (conta) {
        grupo.controls.nomeTitular.setValue(conta.titular);
      } else {
        grupo.controls.nomeTitular.setValue('');
        this.contaNaoEncontrada.set(true);
      }
    });
  }

  /**
   * Confirma o lançamento de crédito/débito com os dados preenchidos no formulário.
   * Se o formulário estiver inválido, marca todos os campos como tocados para exibir mensagens de erro.
   * @returns - Retorna void. Emite o evento `lancamentoConfirmado` com os dados do lançamento, reseta o formulário e limpa os estados de busca e erro.
   */
  onConfirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const conta = this.form.controls.contaCorrente.getRawValue();
    const csc = this.form.controls.documentoCsc.getRawValue();

    const lancamento: Omit<Lancamento, 'idLancamento'> = {
      idLote: this.idLote,
      contaCorrente: conta.contaCorrente,
      nomeTitular: conta.nomeTitular,
      valor: conta.valor!,
      historico: conta.historico,
      estorno: conta.estorno,
      documento: conta.documento,
      descricao: conta.descricao || undefined,
      situacaoConta: this.situacaoContaFixa,
      pa: csc.pa,
      idEvento: csc.idEvento || undefined,
      complHistorico: csc.complHistorico,
      idDocCsc: csc.idDocCsc || undefined,
      situacaoCsc: this.situacaoCscFixa,
    };

    this.lancamentoConfirmado.emit(lancamento);
    this.form.reset();
  }

  /**
   * Fecha o diálogo de inclusão de lançamento, reseta o formulário e limpa os estados de busca e erro.
   * @returns - Retorna void. Emite o evento `visibleChange` com o valor `false` para indicar que o diálogo foi fechado.
   */
  onFechar(): void {
    this.form.reset();
    this.buscandoConta.set(false);
    this.contaNaoEncontrada.set(false);
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
