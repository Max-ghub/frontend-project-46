/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", __dirname] }] */
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (file) => path.join(__dirname, '../__fixtures__', file);

test('Difference', () => {
  const testFile1Path = getPath('file1.json');
  const testFile2Path = getPath('file2.json');

  const text = genDiff(testFile1Path, testFile2Path);
  const result = readFileSync(getPath('result.txt'), 'utf-8').replaceAll('\r', '');

  expect(text).toEqual(result);
});
