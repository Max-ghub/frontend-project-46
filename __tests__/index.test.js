/* eslint no-underscore-dangle: ["error", { "allow": ["__filename", __dirname] }] */
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import genDiff from '../src/index.js';
import parsers from '../src/parsers.js';
import stylish from '../src/formatters/stylish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getPath = (file) => path.join(__dirname, '../__fixtures__', file);

test('Difference', () => {
  const resultFile = readFileSync(getPath('/commonDifference/result.txt'), 'utf-8').replaceAll('\r', '');

  const JSON1Path = getPath('/commonDifference/file1.json');
  const JSON2Path = getPath('/commonDifference/file2.json');
  const JSONgenDiff = genDiff(JSON1Path, JSON2Path);
  expect(JSONgenDiff).toEqual(resultFile);

  const YML1Path = getPath('/commonDifference/file1.yml');
  const YML2Path = getPath('/commonDifference/file2.yml');
  const YMLgenDiff = genDiff(YML1Path, YML2Path);
  expect(YMLgenDiff).toEqual(resultFile);

  const YAML1Path = getPath('/commonDifference/file1.yaml');
  const YAML2Path = getPath('/commonDifference/file2.yaml');
  const YAMLgenDiff = genDiff(YAML1Path, YAML2Path);
  expect(YAMLgenDiff).toEqual(resultFile);
});

test('Recursion difference', () => {
  const resultRecursionFile = readFileSync(getPath('/recursionDifference/resultRecursion.txt'), 'utf-8').replaceAll('\r', '');

  const JSON1RecursionPath = getPath('/recursionDifference/recursion1.json');
  const JSON2RecursionPath = getPath('/recursionDifference/recursion2.json');
  const JSONRecursiongenDiff = genDiff(JSON1RecursionPath, JSON2RecursionPath);
  expect(JSONRecursiongenDiff).toEqual(resultRecursionFile);

  const YML1RecursionPath = getPath('/recursionDifference/recursion1.yml');
  const YML2RecursionPath = getPath('/recursionDifference/recursion2.yml');
  const YMLRecursiongenDiff = genDiff(YML1RecursionPath, YML2RecursionPath);
  expect(YMLRecursiongenDiff).toEqual(resultRecursionFile);

  const YAML1RecursionPath = getPath('/recursionDifference/recursion1.yaml');
  const YAML2RecursionPath = getPath('/recursionDifference/recursion2.yaml');
  const YAMLRecursiongenDiff = genDiff(YAML1RecursionPath, YAML2RecursionPath);
  expect(YAMLRecursiongenDiff).toEqual(resultRecursionFile);
});

test('Errors', () => {
  expect(() => parsers('', undefined)).toThrow(Error);
  expect(() => stylish([{ key: '', type: undefined, value: '' }])).toThrow(Error);
});
