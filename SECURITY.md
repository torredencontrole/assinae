# Segurança do Assinae

## Escopo

O Assinae é uma extensão de navegador que lê o campo de composição do WhatsApp Web para adicionar uma assinatura configurada pelo próprio usuário.

## Dados

A extensão armazena atualmente apenas a configuração `signature` usando `chrome.storage.sync`.

Não devem ser armazenados na assinatura:

- senhas;
- tokens de acesso;
- chaves de API;
- dados de cartão;
- códigos de autenticação;
- informações que o usuário não queira sincronizar entre navegadores.

O uso de `storage.sync` foi mantido na versão 1.1.0 por compatibilidade com a implementação original. Uma futura versão pode migrar a arquitetura para armazenamento local e/ou uma camada de contexto confiável, se isso for necessário ao produto.

## Permissões

A versão 1.1.0 utiliza apenas `storage`. O script de conteúdo é declarado exclusivamente para `https://web.whatsapp.com/*`.

Permissões não utilizadas, como `activeTab`, foram removidas.

## Boas práticas adotadas

- Não são usados `eval`, `new Function` ou execução dinâmica de código.
- A interface do popup usa `textContent` para mensagens de status.
- Links externos usam `rel="noopener noreferrer"`.
- O processamento automático não usa um `setTimeout` recursivo de alta frequência.
- A entrada da assinatura possui limite de 300 caracteres.
- O conteúdo existente do WhatsApp não é enviado para servidores próprios pela extensão.

## Relato de vulnerabilidade

Para relatar uma vulnerabilidade, abra uma issue no repositório público descrevendo o problema sem publicar dados pessoais, credenciais ou provas de conceito que possam colocar outros usuários em risco.

## Próximas etapas de segurança

1. Definir uma estratégia de armazenamento local caso a assinatura não precise de sincronização.
2. Avaliar uma arquitetura com service worker e contexto confiável antes de introduzir novas APIs privilegiadas.
3. Criar testes automatizados para o comportamento do compositor.
4. Automatizar validação do manifesto e do build da extensão.
5. Revisar dependências do projeto Vite/React antes de colocá-las no caminho de execução da extensão.
