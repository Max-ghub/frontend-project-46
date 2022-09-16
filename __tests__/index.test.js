/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", __dirname] }] */
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import genDiff from '../src/index.js';
import parsers from '../src/parsers.js';
import stylish from '../src/formatters/stylish.js';
import plain from '../src/formatters/plain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (file) => path.join(__dirname, '../__fixtures__', file);

test('Difference stylish format', () => {
  const resultStylish = readFileSync(getPath('stylishResult.txt'), 'utf-8').replaceAll('\r', '');

  const JSON1Path = getPath('file1.json');
  const JSON2Path = getPath('file2.json');
  const JSONgenDiff = genDiff(JSON1Path, JSON2Path);
  expect(JSONgenDiff).toEqual(resultStylish);

  const YML1Path = getPath('file1.yml');
  const YML2Path = getPath('file2.yml');
  const YMLgenDiff = genDiff(YML1Path, YML2Path);
  expect(YMLgenDiff).toEqual(resultStylish);

  const YAML1Path = getPath('file1.yaml');
  const YAML2Path = getPath('file2.yaml');
  const YAMLgenDiff = genDiff(YAML1Path, YAML2Path);
  expect(YAMLgenDiff).toEqual(resultStylish);
});

test('Difference plain format', () => {
  const resultPlain = readFileSync(getPath('plainResult.txt'), 'utf-8').replaceAll('\r', '');

  const JSON1Path = getPath('file1.json');
  const JSON2Path = getPath('file2.json');
  const JSONgenDiff = genDiff(JSON1Path, JSON2Path, 'plain');
  expect(JSONgenDiff).toEqual(resultPlain);

  const YML1Path = getPath('file1.yml');
  const YML2Path = getPath('file2.yml');
  const YMLgenDiff = genDiff(YML1Path, YML2Path, 'plain');
  expect(YMLgenDiff).toEqual(resultPlain);

  const YAML1Path = getPath('file1.yaml');
  const YAML2Path = getPath('file2.yaml');
  const YAMLgenDiff = genDiff(YAML1Path, YAML2Path, 'plain');
  expect(YAMLgenDiff).toEqual(resultPlain);
});

test('Difference JSON format', () => {
  const resultJSON = readFileSync(getPath('JSONResult.txt'), 'utf-8').replaceAll('\\', '');

  const JSON1Path = getPath('file1.json');
  const JSON2Path = getPath('file2.json');
  const JSONgenDiff = genDiff(JSON1Path, JSON2Path, 'json');
  expect(JSONgenDiff).toEqual(resultJSON);

  const YML1Path = getPath('file1.yml');
  const YML2Path = getPath('file2.yml');
  const YMLgenDiff = genDiff(YML1Path, YML2Path, 'json');
  expect(YMLgenDiff).toEqual(resultJSON);

  const YAML1Path = getPath('file1.yaml');
  const YAML2Path = getPath('file2.yaml');
  const YAMLgenDiff = genDiff(YAML1Path, YAML2Path, 'json');
  expect(YAMLgenDiff).toEqual(resultJSON);
});

test('Throw errors', () => {
  const JSON1Path = getPath('file1.json');
  const JSON2Path = getPath('file2.json');

  expect(() => genDiff(JSON1Path, JSON2Path, 'undefined')).toThrow(Error);
  expect(() => parsers('', undefined)).toThrow(Error);
  expect(() => stylish([{ key: '', type: undefined, value: '' }])).toThrow(Error);
  expect(() => plain([{ key: '', type: undefined, value: '' }])).toThrow(Error);
});
