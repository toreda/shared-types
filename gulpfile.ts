/**
 *	MIT License
 *
 *	Copyright (c) 2019 - 2026 Toreda, Inc.
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:

 * 	The above copyright notice and this permission notice shall be included in all
 * 	copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * 	SOFTWARE.
 *
 */

import {series} from 'gulp';

import {ESLint} from 'eslint';
import {deleteAsync} from 'del';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';

const srcPatterns = ['src/**.ts', 'src/**/*.ts'];

// Lint runs by default. Set BUILD_LINT=false (e.g. via `cross-env`) to skip.
const lintEnabled = process.env.BUILD_LINT !== 'false';

async function cleanDist() {
	return deleteAsync('dist/**', {
		force: true,
		dryRun: false
	});
}

async function linter() {
	if (!lintEnabled) {
		console.log('Skipping lint (BUILD_LINT=false).');
		return;
	}

	const eslint = new ESLint();
	const results = await eslint.lintFiles(srcPatterns);
	const formatter = await eslint.loadFormatter('stylish');
	const output = formatter.format(results);

	if (output) {
		console.log(output);
	}

	if (results.some((r) => r.errorCount > 0)) {
		throw new Error('ESLint reported errors.');
	}
}

/**
 * Compile with tsc, then mark the output folder's module format so Node
 * loads its .js files as CommonJS or ESM regardless of the root package type.
 */
function compile(tsconfig: string, outDir: string, type: 'commonjs' | 'module'): void {
	execFileSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), '-p', tsconfig], {
		stdio: 'inherit'
	});
	writeFileSync(`${outDir}/package.json`, JSON.stringify({type}, null, '\t') + '\n');
}

/**
 * Node's ESM resolver requires full specifiers. tsc emits relative imports
 * exactly as written in source (extensionless), so append `.js` or
 * `/index.js` to each one in the ESM output, including .d.ts files so
 * TypeScript resolves the types under `node16`/`nodenext`.
 */
function addEsmExtensions(outDir: string): void {
	const specifier = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]*)\2/g;

	for (const entry of readdirSync(outDir, {recursive: true, encoding: 'utf8'})) {
		const file = join(outDir, entry);
		if (!file.endsWith('.js') && !file.endsWith('.d.ts')) {
			continue;
		}

		const dir = dirname(file);
		const src = readFileSync(file, 'utf8');
		const out = src.replace(specifier, (match, prefix: string, quote: string, spec: string) => {
			if (/\.(m|c)?js$/.test(spec)) {
				return match;
			}

			const target = resolve(dir, spec);
			if (existsSync(`${target}.js`)) {
				return `${prefix}${quote}${spec}.js${quote}`;
			}

			if (existsSync(join(target, 'index.js'))) {
				return `${prefix}${quote}${spec}/index.js${quote}`;
			}

			throw new Error(`Cannot resolve '${spec}' imported from ${file}.`);
		});

		if (out !== src) {
			writeFileSync(file, out);
		}
	}
}

async function buildCjs(): Promise<void> {
	compile('tsconfig.cjs.json', './dist/cjs', 'commonjs');
}

async function buildEsm(): Promise<void> {
	compile('tsconfig.esm.json', './dist/esm', 'module');
	addEsmExtensions('./dist/esm');
}

export default series(cleanDist, linter, buildCjs, buildEsm);
