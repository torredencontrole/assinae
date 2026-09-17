import { mkdir, readFile, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { platform } from 'node:os';

const execFileAsync = promisify(execFile);

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

if (platform() === 'win32') {
  const command = `Compress-Archive -Path 'dist\\*' -DestinationPath '${outputFile}' -Force`;
  await execFileAsync('powershell.exe', [
    '-NoProfile',
    '-NonInteractive',
    '-Command',
    command,
  ]);
} else {
  await execFileAsync('zip', ['-r', `../${outputFile}`, '.'], { cwd: 'dist' });
}

console.log(`Assinae: pacote criado em ./${outputFile}`);
