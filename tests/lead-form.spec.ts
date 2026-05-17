import { test, expect, Page } from '@playwright/test';

async function fillRequiredFields(page: Page) {
  await page.getByRole('textbox', { name: 'Ex: Maria Oliveira' }).fill('Maria Oliveira');
  await page.getByRole('textbox', { name: 'maria@empresa.com' }).fill('maria@empresa.com');
  await page.getByRole('textbox', { name: 'Ex: Expansão de contrato' }).fill('Oportunidade Teste');
  await page.locator('label').filter({ hasText: 'Baixa' }).click();
  await page.getByRole('checkbox', { name: 'Plano Starter' }).check();
}

test('CT-01 | happy path: cadastro completo de lead', async ({ page }) => {
  await page.goto('/');

  // Dados do contato
  await page.getByRole('textbox', { name: 'Ex: Maria Oliveira' }).fill('Maria Oliveira');
  await page.getByRole('textbox', { name: 'maria@empresa.com' }).fill('maria@empresa.com');
  await page.getByRole('textbox', { name: '(31) 99999-' }).fill('31987654321');
  await page.getByRole('textbox', { name: 'Ex: Diretor Comercial' }).fill('Diretora de Marketing');
  await page.getByRole('textbox', { name: 'Nome da empresa' }).fill('Test Company');

  // Dados da oportunidade
  await page.getByRole('textbox', { name: 'Ex: Expansão de contrato' }).fill('Expansão de Contrato Test');
  await page.getByRole('textbox', { name: 'R$' }).fill('12000');
  await page.locator('input[type="date"]').fill('2038-09-27');
  await page.getByRole('slider').fill('75');
  await page.locator('label').filter({ hasText: 'Alta' }).click();

  // Observações
  await page.getByRole('textbox', { name: 'Contexto sobre o lead' }).fill('Lorem Ipsum');

  // Coluna direita
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('checkbox', { name: 'Plano Enterprise' }).check();
  await page.getByRole('checkbox', { name: 'Consultoria' }).check();
  await page.getByRole('checkbox', { name: 'Budget confirmado' }).check();
  await page.getByRole('checkbox', { name: 'Autoridade identificada' }).check();

  // Score: 4 estrelas
  await page.locator('span').filter({ hasText: '★' }).nth(3).click();

  // Tags
  await page.getByRole('textbox', { name: 'Digite e pressione Enter' }).fill('enterprise');
  await page.getByRole('textbox', { name: 'Digite e pressione Enter' }).press('Enter');

  // Submeter
  await page.getByRole('button', { name: 'Cadastrar Lead' }).click();

  // Validações
  await expect(page.getByRole('heading', { name: 'Lead cadastrado com sucesso!' })).toBeVisible();
  await expect(page.getByText('Nome: Maria Oliveira')).toBeVisible();
  await expect(page.getByText('Empresa: Test Company')).toBeVisible();
  await expect(page.getByText('Oportunidade: Expansão de Contrato Test')).toBeVisible();
  await expect(page.getByText('Prioridade: alta')).toBeVisible();
});

test('CT-02 | enviar formulário vazio -validação de campos obrigatórios', async ({ page }) => {
  await page.goto('/');

  // Tentar submeter sem preencher campos
  await page.getByRole('button', { name: 'Cadastrar Lead' }).click();

  // Validações de erros
  await expect(page.getByText('Nome é obrigatório')).toBeVisible();
  await expect(page.getByText('Email inválido')).toBeVisible();
  await expect(page.getByText('Título é obrigatório')).toBeVisible();
  await expect(page.getByText('Selecione uma prioridade')).toBeVisible();
  await expect(page.getByText('Selecione ao menos um produto')).toBeVisible();
}); 


test('CT-04 | email inválido bloqueia envio', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('textbox', { name: 'Ex: Maria Oliveira' }).fill('Maria Oliveira');
  await page.getByRole('textbox', { name: 'maria@empresa.com' }).fill('emailsemarroba.com');
  await page.getByRole('textbox', { name: 'Ex: Expansão de contrato' }).fill('Oportunidade Teste');
  await page.locator('label').filter({ hasText: 'Baixa' }).click();
  await page.getByRole('checkbox', { name: 'Plano Starter' }).check();
  await page.getByRole('button', { name: 'Cadastrar Lead' }).click();

  await expect(page.getByText('Email inválido')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lead cadastrado com sucesso!' })).not.toBeVisible();
});

test('CT-05 | telefone incompleto bloqueia envio', async ({ page }) => {
  await page.goto('/');

  await fillRequiredFields(page);
  await page.getByRole('textbox', { name: '(31) 99999-' }).fill('31 9999');
  await page.getByRole('button', { name: 'Cadastrar Lead' }).click();

  await expect(page.getByText('Telefone incompleto')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lead cadastrado com sucesso!' })).not.toBeVisible();
});

test.skip('CT-07 | [BUG] data de hoje bloqueada incorretamente(timezone-dependent, só reproduz em UTC-3)', async ({ page }) => {
  await page.goto('/');

  await fillRequiredFields(page);

  const today = new Date().toISOString().split('T')[0];
  await page.locator('input[type="date"]').fill(today);
  await page.getByRole('button', { name: 'Cadastrar Lead' }).click();

  // Esperado: sucesso. Atual: bloqueado com erro de data no passado.
  await expect(page.getByRole('heading', { name: 'Lead cadastrado com sucesso!' })).toBeVisible();
});