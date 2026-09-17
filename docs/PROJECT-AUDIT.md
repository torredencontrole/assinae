# Auditoria técnica inicial — Assinae

## 1. Fluxo existente

### Manifesto

O projeto já utiliza Manifest V3. O script de conteúdo é carregado somente no WhatsApp Web e o popup é definido como `popup.html`.

### Configuração

`popup.js` lê e grava a chave `signature` em `chrome.storage.sync`.

### Aplicação da assinatura

`content.js` localiza o campo de composição do WhatsApp Web e adiciona a assinatura no formato:

```text
*assinatura*
mensagem
```

A implementação original verificava o DOM continuamente por meio de chamadas recursivas a cada 200 ms.

## 2. Problemas encontrados

### Alto impacto de manutenção

A lógica original dependia de seletores específicos do DOM do WhatsApp Web. Alterações do WhatsApp podem exigir atualização do seletor.

### Desempenho

O `setTimeout` recursivo de 200 ms fazia leituras do DOM e consultas ao `chrome.storage.sync` continuamente. Isso foi substituído por cache da assinatura, eventos de entrada e `MutationObserver`.

### Permissões

`activeTab` estava declarado, mas não era usado pelo código existente. Foi removido para reduzir a superfície de permissões.

### Logs

O popup registrava a assinatura completa no console. Isso foi removido para evitar exposição desnecessária de dado configurado pelo usuário.

### Validação

A assinatura não tinha limite explícito. Foi adicionado limite de 300 caracteres e feedback visual de salvamento/erro.

### Identidade da extensão

O campo `key` existente foi preservado nesta etapa para reduzir o risco de mudança de identidade/ID durante a migração. A documentação deixa explícito que esse valor não é um segredo.

### Build

Há uma base Vite/React/TypeScript no projeto, porém o fluxo atual da extensão usa os arquivos diretamente na raiz. Não foi feita uma migração automática para Vite porque isso poderia quebrar a extensão existente. Essa integração será uma etapa separada, depois dos testes funcionais.

## 3. Alterações da versão 1.1.0

- Nome da extensão padronizado para Assinae.
- Manifest V3 mantido.
- `activeTab` removido.
- `update_url` removido do manifesto, pois não há ainda um processo de publicação/atualização definido na Chrome Web Store.
- `run_at: document_idle` definido explicitamente.
- Polling recursivo de 200 ms removido.
- Cache da assinatura adicionado.
- `chrome.storage.onChanged` adicionado para refletir mudanças sem recarregar a página.
- Observação de mudanças do DOM e eventos do compositor adicionados para lidar melhor com o comportamento de SPA do WhatsApp Web.
- Logs que poderiam expor a assinatura removidos.
- Limite de 300 caracteres adicionado.
- Feedback de sucesso/erro adicionado ao popup.
- Links externos endurecidos com `noopener noreferrer`.
- README e política de segurança adicionados.

## 4. O que não foi alterado propositalmente

- O formato da assinatura.
- A chave `signature` do armazenamento.
- O uso de `chrome.storage.sync` nesta primeira etapa.
- Os arquivos de backup existentes.
- A base Vite/React/TypeScript.
- O mecanismo de inserção baseado no DOM do WhatsApp Web.

Essas decisões reduzem o risco de uma mudança estrutural quebrar o comportamento que já funcionava.

## 5. Plano de testes

1. Carregar a pasta como extensão descompactada.
2. Configurar uma assinatura simples.
3. Abrir uma conversa no WhatsApp Web.
4. Digitar uma mensagem curta e verificar a assinatura.
5. Editar uma mensagem antes do envio.
6. Trocar de conversa sem recarregar o WhatsApp.
7. Recarregar o WhatsApp Web.
8. Reabrir o popup e confirmar a persistência da assinatura.
9. Alterar a assinatura com o WhatsApp aberto e verificar a atualização.
10. Testar assinatura vazia.
11. Testar assinatura com caracteres acentuados, emojis e quebras de linha.
12. Testar assinatura próxima do limite de 300 caracteres.

## 6. Próxima etapa após os testes

Somente depois de validar o fluxo acima, definir o empacotamento Vite/React, testes automatizados e uma arquitetura de distribuição/publicação. A prioridade é preservar o funcionamento atual antes de introduzir novas dependências ou APIs.
