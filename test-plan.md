# Test Plan: Cadastro de Lead

## Objetivo
Garantir a qualidade da tela de cadastro de leads, assegurando que o happy path seja concluído com sucesso e identificando possíveis erros, inconsistências de validação e problemas de UX no fluxo.

## Escopo

**Dentro do escopo**
- Validação de campos obrigatórios
- Validação de formato (email, telefone, data, valor)
- Comportamento dos componentes interativos (slider, checkboxes, radio, stars, tags)
- Fluxo de sucesso (submissão e tela de confirmação)
- Comportamento dos botões do footer (Cancelar, Salvar rascunho, Cadastrar Lead)
- Limites de caracteres e valores

**Fora do escopo**
- Persistência real em banco de dados
- Integração com APIs externas
- Testes de performance e carga
- Responsividade mobile

## Ambiente
- Navegador: Google Chrome (versão a preencher)
- URL: http://localhost:5173
- Sistema operacional: macOS (a preencher)
- Data de execução: a preencher

---

## Casos de Teste

---

### CT-01 — Happy path completo

**Pré-condição:** Formulário em estado inicial, todos os campos vazios.

**Passos:**
1. Preencher Nome completo com "Maria Oliveira"
2. Preencher Email com "maria@empresa.com"
3. Preencher Telefone com "(31) 99999-9999"
4. Preencher Cargo com "Diretora Comercial"
5. Preencher Empresa com "Empresa Exemplo"
6. Preencher Título da oportunidade com "Expansão — Plano Enterprise"
7. Preencher Valor estimado com "R$ 5.000,00"
8. Selecionar data de fechamento futura
9. Ajustar slider de probabilidade para 70%
10. Selecionar Prioridade "Alta"
11. Preencher Observações com texto livre
12. Selecionar Responsável "Ana Costa"
13. Marcar produtos "Plano Enterprise" e "Consultoria"
14. Marcar todos os itens BANT
15. Selecionar 4 estrelas no Score
16. Adicionar tags "enterprise" e "expansao"
17. Clicar em "Cadastrar Lead"

**Resultado esperado:** Tela de sucesso exibida com resumo do lead (nome, empresa, título, valor, prioridade).

**Resultado obtido:** Lead Cadastrado e Tela de sucesso exibida com o resumo do lead

**Status:** Passou

**Severidade:** Crítica

---

### CT-02 — Submissão com todos os campos obrigatórios vazios

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Não preencher nenhum campo
2. Clicar em "Cadastrar Lead"

**Resultado esperado:** Formulário não é submetido. Mensagens de erro exibidas em: Nome, Email, Título da oportunidade, Prioridade e Produto/Serviço.

**Resultado obtido:** Formulario não é obtido e campos obrigatórios ficam em vermelho, com mensagens adequadas, indicando que devem ser preenchidos

**Status:** Passou

**Severidade:** Crítica

---

### CT-03 — Submissão apenas com campos obrigatórios preenchidos

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher Nome com "João Silva"
2. Preencher Email com "joao@empresa.com"
3. Preencher Título com "Oportunidade Teste"
4. Selecionar Prioridade "Baixa"
5. Marcar produto "Plano Starter"
6. Deixar Telefone, Cargo, Empresa, Valor, Data, Responsável, BANT, Score e Tags vazios
7. Clicar em "Cadastrar Lead"

**Resultado esperado:** Lead cadastrado com sucesso. Campos opcionais não bloqueiam o envio.

**Resultado obtido:** Formulario foi enviado apenas com os campos obrigatorios. OBS: Responsavel deveria ser um campo obrigatorio.

**Status:** Passou com observação

**Severidade:** Alta

---

### CT-04 — Validação de email inválido

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher Nome com "Teste"
2. Preencher Email com "emailsemarroba.com"
3. Preencher Título com "Teste"
4. Selecionar Prioridade "Baixa"
5. Marcar um produto
6. Clicar em "Cadastrar Lead"

**Resultado esperado:** Erro exibido no campo Email: "Email inválido". Formulário não submetido.

**Resultado obtido:** Formulario não é enviado e campo de email fica destacado em vermelho, com mensagem: email invalido

**Status:** Passou

**Severidade:** Alta

---

### CT-05 — Validação de telefone incompleto

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher campos obrigatórios válidos
2. Preencher Telefone com "(31) 9999" (incompleto)
3. Clicar em "Cadastrar Lead"

**Resultado esperado:** Erro exibido no campo Telefone: "Telefone incompleto". Formulário não submetido.

**Resultado obtido:** Formulario não e1 enviado, e campo de telefone é destacado em vermelho, com mensagem telefone incompleto. OBS: campo valida 9 digitos contando o ddd, então o exemplo (31 98765-43) é aceito, na realidade esse telefone nao deveria existir, se tratando de brasil

**Status:** Passou com OBS.

**Severidade:** Média

---

### CT-06 — Validação de data de fechamento no passado

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher campos obrigatórios válidos
2. Selecionar uma data de fechamento no passado (ex: ontem)
3. Clicar em "Cadastrar Lead"

**Resultado esperado:** Erro exibido no campo Data: "A data não pode ser no passado". Formulário não submetido.

**Resultado obtido:**  Erro exibido no campo Data: "A data não pode ser no passado". Formulário não submetido.

**Status:** Passou

**Severidade:** Média

---

### CT-07 — [BUG] Data de hoje bloqueada incorretamente

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher campos obrigatórios válidos
2. Selecionar a data de hoje como data de fechamento
3. Clicar em "Cadastrar Lead"

**Resultado esperado:** Formulário submetido com sucesso. Data de hoje deve ser permitida.

**Resultado obtido:** Envio do formulario é bloqueado, campo fica destacado e mensagem A data não pode ser no passado
aparece

**Status:** Falhou

**Severidade:** Média

---

### CT-08 — [BUG] Campos de texto aceitam apenas caracteres especiais e números

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher Nome com "12345!@#$%"
2. Preencher Email com "teste@empresa.com"
3. Preencher Título com "!@#$%"
4. Selecionar Prioridade "Baixa"
5. Marcar um produto
6. Clicar em "Cadastrar Lead"

**Resultado esperado:** Erro de validação em Nome e Título. Campos de nome devem exigir ao menos letras.

**Resultado obtido:** Formulario enviado sem validaçao de letras

**Status:** Falhou

**Severidade:** Média

**Observação:** Campo Empresa pode ter números no nome ("3M", "99 Freelas") — avaliar separadamente.

---

### CT-09 — [BUG] Valor estimado sem limite de dígitos quebra tela de sucesso

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Preencher campos obrigatórios válidos
2. Preencher Valor estimado digitando 20+ dígitos consecutivos
3. Clicar em "Cadastrar Lead"

**Resultado esperado:** Campo deve limitar a entrada ou exibir erro. Tela de sucesso não deve ter layout quebrado.

**Resultado obtido:** Formulario é enviado e tela de sucesso tem o layout quebrado, com os numeros saindo da tela

**Status:** Falhou

**Severidade:** Alta

---

### CT-10 — [BUG] Cancelar sem confirmação descarta dados preenchidos

**Pré-condição:** Formulário parcialmente preenchido (ao menos 5 campos).

**Passos:**
1. Preencher Nome, Email, Título, Prioridade e Produto
2. Clicar em "Cancelar"

**Resultado esperado:** Modal de confirmação pergunta "Deseja descartar as alterações?". Dados só são perdidos após confirmação.

**Resultado obtido:** Todos os dados sao descartados sem nenhuma confirmacao.

**Status:** Falhou

**Severidade:** Média

---

### CT-11 — [BUG] Salvar rascunho não persiste o estado do formulário

**Pré-condição:** Formulário parcialmente preenchido.

**Passos:**
1. Preencher Nome com "Rascunho Teste" e Email com "rascunho@empresa.com"
2. Clicar em "Salvar rascunho"
3. Alterar o campo Nome para "Outro Nome"
4. Observar comportamento

**Resultado esperado:** Após salvar rascunho, o formulário deve preservar o estado salvo. Alterações posteriores devem ser tratadas como novas modificações não salvas.

**Resultado obtido:** Modal de sucesso "o rascunho foi salvo" aparece porem a tela permanece igual, deveria sair para uma nova tela vazia e permitir voltar no rascunho salvo mais tarde 

**Status:** Falhou

**Severidade:** Alta

---

### CT-12 — Limite de caracteres no campo Observações

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Clicar no campo Observações
2. Colar ou digitar um texto com exatamente 500 caracteres
3. Tentar digitar mais um caractere

**Resultado esperado:** Campo aceita exatamente 500 caracteres e bloqueia entrada adicional. Contador exibe "500/500".

**Resultado obtido:** _Campo limitou em 500 e contador exibiu corretamente.

**Status:** Passou 

**Severidade:** Baixa

---

### CT-13 — Interação do slider de probabilidade

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Mover slider para 0%
2. Verificar label exibido
3. Mover slider para 100%
4. Verificar label exibido
5. Mover slider para 50%
6. Verificar label exibido

**Resultado esperado:** Slider responde visualmente, percentual atualiza em tempo real, valores 0% e 100% são aceitos.

**Resultado obtido:** Slider responde visualmente, percentual é atualizado em tempo real, e valores limites são aceitos

**Status:** Passou

**Severidade:** Baixa

---

### CT-14 — Qualificação BANT atualiza indicador de score

**Pré-condição:** Formulário em estado inicial, nenhum item BANT marcado.

**Passos:**
1. Verificar indicador: deve exibir "0/4" em vermelho
2. Marcar "Budget confirmado" — verificar indicador
3. Marcar "Autoridade identificada" — verificar indicador
4. Marcar os 4 itens — verificar indicador
5. Desmarcar um item — verificar indicador

**Resultado esperado:** Indicador atualiza em tempo real. 0-1 vermelho, 2-3 amarelo, 4 verde.

**Resultado obtido:** Indicador atualiza em tempo real. 0-1 vermelho, 2-3 amarelo, 4 verde.

**Status:** Passou

**Severidade:** Baixa

---

### CT-15 — Tags: adicionar e remover

**Pré-condição:** Formulário em estado inicial.

**Passos:**
1. Digitar "enterprise" no campo Tags e pressionar Enter
2. Verificar se a tag aparece
3. Digitar "enterprise" novamente e pressionar Enter
4. Verificar se duplicata é bloqueada
5. Clicar no "×" da tag "enterprise"
6. Verificar se a tag foi removida

**Resultado esperado:** Tag adicionada na primeira vez, bloqueada na duplicata, removida ao clicar no "×".

**Resultado obtido:** Tag adicionada na primeira vez, bloqueada na duplicata, removida ao clicar no "x". OBS: Deveria ser exibido uma mensagem ou label avisando que duplicatas sao bloqueadas, o comportamento nao é c;aro para o usuario

**Status:** Passou com OBS

**Severidade:** Baixa

---

## Bugs encontrados

| ID | Campo / Componente | Descrição | Severidade |
|---|---|---|---|
| BUG-01 | Data de fechamento | Data de hoje é bloqueada incorretamente como passado | Média |
| BUG-02 | Nome, Título | Aceita envio com apenas caracteres especiais e números | Média |
| BUG-03 | Valor estimado | Sem limite de dígitos, quebra layout da tela de sucesso | Alta |
| BUG-04 | Botão Cancelar | Descarta dados sem confirmação do usuário | Média |
| BUG-05 | Salvar rascunho | Não persiste estado, apenas exibe alert genérico | Alta |
| BUG-06 | Campos de texto | Nome, Cargo, Empresa e Tags sem limite de caracteres definido | Baixa |