# Assinae

Extensão para Google Chrome que adiciona uma assinatura personalizada às mensagens enviadas pelo WhatsApp Web.

## Estado atual

- Manifest V3.
- Funciona exclusivamente em `https://web.whatsapp.com/*`.
- A assinatura é salva usando `chrome.storage.sync` para preservar o comportamento existente.
- A assinatura é aplicada automaticamente ao campo de mensagem.
- O processamento do WhatsApp usa eventos e `MutationObserver`, sem polling recursivo a cada 200 ms.
- O popup valida o tamanho da assinatura e informa o resultado do salvamento.
- A nova base de código utiliza TypeScript para o content script e o popup.
- O projeto possui um build dedicado que gera uma versão pronta da extensão em `dist/`.

## Instalação para desenvolvimento

1. Baixe ou clone este repositório.
2. Abra `chrome://extensions` no Google Chrome.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Para testar rapidamente sem build, selecione a pasta raiz do projeto, que contém `manifest.json`.
6. Para testar o build moderno, execute `npm install` e depois `npm run build`; em seguida carregue a pasta `dist`.
7. Abra o WhatsApp Web e recarregue a página.
8. Clique no ícone da extensão e configure a assinatura.

## Desenvolvimento

A extensão mantém os arquivos JavaScript da raiz como caminho de compatibilidade para o carregamento direto durante o desenvolvimento. A fonte moderna fica em TypeScript:

- `src/content.ts`: fonte do content script.
- `src/popup.ts`: fonte da interface e persistência da assinatura.
- `tsconfig.extension.json`: configuração TypeScript específica da extensão.
- `scripts/build-extension.mjs`: gera a extensão pronta em `dist/`.

Comandos principais:

```bash
npm run typecheck:extension
npm run build
```

O build compila os arquivos TypeScript e copia o manifesto, popup e ícones para `dist/`, sem alterar o comportamento funcional da versão de desenvolvimento.

## Estrutura principal

- `manifest.json`: configuração da extensão e permissões.
- `content.js`: compatibilidade com o carregamento direto atual.
- `popup.html`: interface de configuração.
- `popup.js`: compatibilidade com o carregamento direto atual.
- `src/content.ts`: implementação TypeScript do content script.
- `src/popup.ts`: implementação TypeScript do popup.
- `icons/`: ícones da extensão.
- `src/`: base React/Vite mantida para evolução futura da interface.
- `_metadata/`: arquivos de metadados existentes no projeto original.

## Segurança e permissões

A extensão usa somente a permissão `storage` no manifesto. A injeção do script é restrita ao domínio do WhatsApp Web por meio de `content_scripts.matches`.

A assinatura continua em `chrome.storage.sync` nesta etapa para evitar uma alteração funcional brusca. Como o Chrome pode sincronizar esse armazenamento entre navegadores do mesmo usuário, não use a extensão para armazenar segredos, senhas, tokens ou informações que não devam ser sincronizadas. Consulte `SECURITY.md` para o plano de endurecimento futuro.

O campo `key` do manifesto foi mantido nesta versão para preservar a identidade/ID existente da extensão durante a migração. Essa chave não deve ser tratada como um segredo.

## Identidade

O nome oficial do projeto é **Assinae**. Referências antigas ao nome `AssinaWhats` não fazem parte da identidade atual do projeto.

O nome do responsável utilizado em documentação ou metadados deve ser **Anderson Bernardo de Souza**.
