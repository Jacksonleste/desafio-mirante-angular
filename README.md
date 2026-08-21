# Outros Créditos/Débitos — Desafio Front-end Angular

Modernização de duas telas do módulo contábil "Outros Créditos/Débitos" (Adobe Flex → Angular), desenvolvido como desafio técnico para o processo seletivo da Mirante Tecnologia.

- **Tela 1** — Consulta de Lotes: filtros, tabela paginada, seleção e barra de ações.
- **Tela 2** — Modal Incluir Lançamento: formulário reativo com validações, aberto a partir da Tela 1.

Projeto exclusivamente front-end — todos os dados são simulados em memória (mock), sem back-end real.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | Angular 21 (standalone components) |
| Linguagem | TypeScript |
| UI Components | PrimeNG |
| Estilização | Tailwind CSS |
| Testes | Vitest (builder `@angular/build:unit-test`, padrão do Angular 21) |
| Formulários | Reactive Forms |
| Estado | Angular Signals |
| Dados | Mock em memória, simulado com RxJS (`of` + `delay`) |

---

## Como executar

Pré-requisitos: Node.js LTS mais recente.

```bash
npm install
ng serve
```

A aplicação sobe em `http://localhost:4200`.

## Como rodar os testes

```bash
ng test
```

---

## Estrutura de pastas

```
src/app/
  core/
    models/        # Lote, Lancamento, ContaCorrente, enums
    services/       # LoteService, LancamentoService, ContaCorrenteService, OpcoesFormularioService
    mocks/          # dados simulados (gerados com seed fixa, reproduzíveis)
  features/
    outros-creditos-debitos/
      pages/
        consulta-lotes/       # Tela 1 (rota)
      components/
        filtro-lotes/          # painel de filtros (reactive form)
        barra-acoes-lote/      # barra de ações da Tela 1
      dialogs/
        incluir-lancamento/    # Tela 2 (modal)
  shared/
    components/
      data-table/              # tabela genérica reutilizável (TS generics)
    models/
      paginacao.model.ts       # contrato de paginação, usado por qualquer service paginado
```

**Regra de organização**: tipos acoplados a um componente específico (ex.: `ColumnDef<T>`) ficam junto do componente que os usa; tipos genéricos reutilizáveis por múltiplas camadas (ex.: `PaginacaoRequest`) ficam em `shared/models/`.

---

## Decisões técnicas relevantes

### Framework de testes: Vitest, não Jasmine/Karma
A partir do Angular 21, o Vitest é o test runner padrão gerado pelo `ng new`. Optei por seguir esse padrão em vez de forçar Jasmine/Karma — a sintaxe (`describe`/`it`/`expect`) é praticamente idêntica ao Jest, atendendo ao espírito do requisito original.

### Nomenclatura: sufixos `.component`/`.service` mantidos
O Angular 20+ removeu a exigência de sufixar arquivos com o tipo do construto Angular. Optei por manter a convenção clássica (`consulta-lotes.component.ts`, `lote.service.ts`) por ser mais reconhecível em contexto de avaliação técnica — é uma opção ainda suportada oficialmente (`ng generate --type=component`), não uma convenção obsoleta.

### Tabela reutilizável com TypeScript generics
`DataTableComponent<T extends object>` (em `shared/components/data-table/`) é um wrapper genérico sobre o `p-table` do PrimeNG, configurável via `ColumnDef<T>[]`. A constraint `T extends object` (em vez de `Record<string, unknown>`) evita exigir index signature dos models de domínio, que não precisam ter essa característica estrutural. Colunas do tipo `currency`/`date` usam métodos de cast isolados e nomeados (`valorMonetario`, `valorData`, `valorTexto`) em vez de `$any()` espalhado no template — limitação conhecida de generics do TypeScript com informação de tipo que só existe em runtime.

### Paginação lazy (simulando server-side)
A tabela usa o modo `[lazy]="true"` do PrimeNG. `LoteService.pesquisar(filtro, paginacao)` aplica o filtro sobre a base inteira (simula `WHERE`) e só depois fatia o resultado (simula `LIMIT`/`OFFSET`), retornando `{ data, totalRecords }`. Filtro e paginação são mantidos como estados separados na página, para que trocar de página não descarte o filtro aplicado.

### Formulário do modal com `FormGroups` aninhados
O formulário de Incluir Lançamento é dividido em dois `FormGroups` filhos (`contaCorrente` e `documentoCsc`), refletindo a divisão visual real do modal e evitando colisão de nomes de campo (ex.: um possível campo `situacao` em cada seção não colide, porque cada um vive no seu próprio namespace).

### Validadores customizados
Dois validadores cross-field (aplicados no nível do `FormGroup`, não em campos isolados, pois dependem de mais de um campo simultaneamente):
- `faixaValidaValidator` (filtros): garante que os campos "De" não sejam maiores que "Até" nas três faixas (ID Lote, Valor Lote, Data Entrada).
- `contaLocalizadaValidator` (modal): garante que uma conta corrente digitada tenha sido efetivamente localizada pela busca antes de permitir salvar o lançamento.

### Estado com Signals
Signals são usados apenas onde o valor é lido diretamente pelo template (dispara re-renderização). Estados de uso puramente interno (ex.: filtro e paginação atuais, usados só para montar a próxima chamada ao service) permanecem como propriedades comuns, evitando reatividade desnecessária.

### Mocks gerados com seed fixa
Os dados de lote e lançamento são gerados por um gerador pseudo-aleatório determinístico (mesma sequência de valores a cada execução), e os lançamentos são gerados **a partir** da quantidade real de cada lote (`flatMap`), garantindo que `quantLancamentos` sempre bate com a quantidade real de lançamentos simulados — evita inconsistência de dados entre as duas listas mockadas.

---

## Simplificações e itens fora do escopo

O desafio inclui um texto descritivo e imagens de referência que nem sempre coincidem em nível de detalhe. As decisões abaixo foram tomadas com base na leitura crítica de ambos; nos pontos que permaneceram ambíguos, a recrutadora orientou que eu decidisse a implementação da forma que considerasse mais adequada.

### Seção "Documento CSC" — campo ID Evento simplificado
O texto autoriza explicitamente simplificar os campos de Documento CSC além de PA. As imagens de referência mostram um modal de busca paginado (lookup) para o campo ID Evento — implementei o campo como um input simples, sem esse modal de busca, mantendo a fidelidade visual do campo em si.

### Seção "Anexo" — fora do escopo
A seção de upload/CRUD de anexos aparece apenas nas imagens de referência, sem qualquer menção no texto do enunciado. Não foi implementada.

### Grade de lançamentos e ações Alterar/Excluir/Duplicar de lançamento — não implementadas
O texto menciona "grade de lançamentos do lote" e botões "Visualizar, Incluir, Alterar e Excluir para os lançamentos do lote, além de Duplicar", mas não deixa claro onde esses elementos vivem estruturalmente — o texto descreve apenas 2 telas, enquanto as imagens de referência sugerem uma terceira tela (não descrita) com essas grades e ações.

Levei essa dúvida à recrutadora, que orientou que eu decidisse a implementação da forma que considerasse mais adequada.

**Decisão**: implementei o fluxo de inclusão de lançamento a partir de um lote selecionado na Tela 1 (botão "Incluir" da barra de ações passa a exigir exatamente 1 lote selecionado, mesma regra de Alterar/Excluir/Visualizar). Ao salvar, o lançamento é persistido em memória e a coluna "Quant. Lançamentos" do lote é atualizada na Tela 1. Não implementei uma grade dedicada de visualização/edição de lançamentos, nem as ações Alterar, Excluir e Duplicar no nível de lançamento — priorizando entregar o fluxo core com solidez dentro do prazo, diante de uma ambiguidade estrutural do enunciado.

---

## Suposições assumidas

| Item | Suposição |
|---|---|
| Campo `Descrição` (seção Conta Corrente) | Tratado como opcional — o enunciado não especifica obrigatoriedade |
| Botões Confirmar / Enviar / Visualizar Justificativa | Sempre habilitados — o enunciado não define regra de habilitação para eles (diferente de Alterar/Excluir/Visualizar/Incluir, que exigem exatamente 1 lote selecionado) |
| Comportamento de Confirmar / Enviar / Visualizar Justificativa | Não implementado — o enunciado não descreve a regra de negócio por trás dessas ações |

---

## Diferenciais implementados

- Signals para estado local e nova sintaxe de control flow (`@if`/`@for`)
- Debounce e tratamento de erro simulado na busca de conta corrente (feedback de loading e "conta não localizada")
- Testes unitários (Vitest) cobrindo: services mock, validadores customizados, lógica de habilitação de botões e estado de formulário reativo
- Tipagem explícita em todos os models, incluindo tipos genéricos (`ColumnDef<T>`, `PaginacaoResponse<T>`)

---

## Histórico de commits

O desenvolvimento seguiu commits pequenos e incrementais (conventional commits).
