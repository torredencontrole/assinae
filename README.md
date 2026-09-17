# Assinae

Extensão para Google Chrome que adiciona uma assinatura personalizada às mensagens enviadas pelo WhatsApp Web.

## Estado atual

- Manifest V3.
- Funciona exclusivamente em `https://web.whatsapp.com/*`.
- A assinatura é salva usando `chrome.storage.sync` para preservar o comportamento existente.
- A assinatura é aplicada automaticamente ao campo de mensagem.
- O processamento do WhatsApp usa eventos e `MutationObserver`, sem polling recursivo a cada 200 ms.
- O popup valida o tamanho da assinatura e informa o resultado do salvamento.

## Instalação para desenvolvimento

1. Baixe ou clone este repositório.
2. Abra `chrome://extensions` no Google Chrome.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta raiz do projeto, a pasta que contém `manifest.json`.
6. Abra o WhatsApp Web e recarregue a página.
7. Clique no ícone da extensão e configure a assinatura.

## Estrutura principal

- `manifest.json`: configuração da extensão e permissões.
- `content.js`: integração com o campo de mensagem do WhatsApp Web.
- `popup.html`: interface de configuração.
- `popup.js`: persistência e validação da assinatura.
- `icons/`: ícones da extensão.
- `src/`: base React/Vite mantida para evolução futura da interface, sem participar do fluxo atual da extensão.
- `_metadata/`: arquivos de metadados existentes no projeto original.

## Segurança e permissões

A extensão usa somente a permissão `storage` no manifesto. A injeção do script é restrita ao domínio do WhatsApp Web por meio de `content_scripts.matches`.

A assinatura continua em `chrome.storage.sync` nesta etapa para evitar uma alteração funcional brusca. Como o Chrome pode sincronizar esse armazenamento entre navegadores do mesmo usuário, não use a extensão para armazenar segredos, senhas, tokens ou informações que não devam ser sincronizadas. Consulte `SECURITY.md` para o plano de endurecimento futuro.

O campo `key` do manifesto foi mantido nesta versão para preservar a identidade/ID existente da extensão durante a migração. Essa chave não deve ser tratada como um segredo.

## Desenvolvimento

O projeto contém uma base Vite + React + TypeScript, mas o carregamento atual da extensão é feito diretamente pelos arquivos raiz (`manifest.json`, `popup.html`, `popup.js` e `content.js`). Antes de transformar o processo em um build empacotado, será necessário definir explicitamente a arquitetura de build da extensão para não quebrar o fluxo atual.

## Histórico

A versão `1.1.0` é a primeira etapa de estabilização: redução de permissões não utilizadas, remoção de polling contínuo, melhoria do popup, validação de entrada e documentação de segurança.
