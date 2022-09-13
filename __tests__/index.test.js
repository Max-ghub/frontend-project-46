/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", __dirname] }] */
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (file) => path.join(__dirname, '../__fixtures__', file);

const resultFile = readFileSync(getPath('result.txt'), 'utf-8').replaceAll('\r', '');
test('JSON difference', () => {
  const JSON1Path = getPath('file1.json');
  const JSON2Path = getPath('file2.json');
  const JSONgenDiff = genDiff(JSON1Path, JSON2Path);
  expect(JSONgenDiff).toEqual(resultFile);
});
test('YAML/YML difference', () => {
  const YML1Path = getPath('file1.yml');
  const YML2Path = getPath('file2.yml');
  const YMLgenDiff = genDiff(YML1Path, YML2Path);
  expect(YMLgenDiff).toEqual(resultFile);

  const YAML1Path = getPath('file1.yaml');
  const YAML2Path = getPath('file2.yaml');
  const YAMLgenDiff = genDiff(YAML1Path, YAML2Path);
  expect(YAMLgenDiff).toEqual(resultFile);
});
