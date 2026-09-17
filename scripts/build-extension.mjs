import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const npmCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
await execFileAsync(npmCommand, ['tsc', '-p', 'tsconfig.extension.json']);

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'));

for (const contentScript of manifest.content_scripts ?? []) {
  contentScript.js = contentScript.js.map((file) =>
    file === 'content.js' ? 'src/content.js' : file,
  );
}

await writeFile(
  'dist/manifest.json',
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
);

const popupHtml = await readFile('popup.html', 'utf8');
const builtPopupHtml = popupHtml.replace(
  '<script src="popup.js"></script>',
  '<script src="src/popup.js"></script>',
);

await writeFile('dist/popup.html', builtPopupHtml, 'utf8');
await cp('icons', 'dist/icons', { recursive: true });

console.log('Assinae: build da extensão concluído em ./dist');
