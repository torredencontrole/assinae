import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const archiver = require('archiver');

const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const version = packageJson.version;
const outputDir = 'release';
const outputFile = `${outputDir}/assinae-v${version}.zip`;

await mkdir(outputDir, { recursive: true });
await rm(outputFile, { force: true });

await execFileAsync(process.execPath, ['scripts/build-extension.mjs']);

const manifest = JSON.parse(await readFile('dist/manifest.json', 'utf8'));
if (manifest.version !== version) {
  throw new Error(
    `Versoes divergentes: package.json=${version} e manifest.json=${manifest.version}`,
  );
}

const output = createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

const closePromise = new Promise((resolve, reject) => {
  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);
});

archive.pipe(output);
archive.directory('dist/', false);
await archive.finalize();
await closePromise;

console.log(`Assinae: pacote criado em ./${outputFile}`);
