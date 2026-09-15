import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const backendDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = resolve(backendDir, '..', '.tmp', 'prisma-dev');
const localAppData = resolve(backendDir, '..', '.tmp', 'local-app-data');
const prismaCli = resolve(backendDir, 'node_modules', 'prisma', 'build', 'index.js');
const serverName = 'garantiy-aid';

mkdirSync(tempDir, { recursive: true });
mkdirSync(localAppData, { recursive: true });

const env = { ...process.env, TEMP: tempDir, TMP: tempDir, LOCALAPPDATA: localAppData };
const list = spawnSync(process.execPath, [prismaCli, 'dev', 'ls'], { env, encoding: 'utf8' });
const knownServer = `${list.stdout ?? ''}${list.stderr ?? ''}`.includes(serverName);
const args = knownServer
  ? [prismaCli, 'dev', 'start', serverName]
  : [prismaCli, 'dev', '-n', serverName, '-d'];
const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });

process.exit(result.status ?? 1);
