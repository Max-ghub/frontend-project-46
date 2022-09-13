import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseData from './parsers.js';

// const getAbslPath = (fileName) => path.resolve(process.cwd(), `__fixtures__/${fileName}`);
const getAbslPath = (fileName) => path.resolve(process.cwd(), fileName);

const getDataDifferences = (firstFile, secondFile) => {
  const firstDataParsed = parseData(firstFile);
  const firstDataKeys = _.keys(firstDataParsed);

  const secondDataParsed = parseData(secondFile);
  const secondDataKeys = _.keys(secondDataParsed);

  const unionDataKeys = _.union(firstDataKeys, secondDataKeys);
  const sortedDataKeys = _.sortBy(unionDataKeys);

  const differences = sortedDataKeys.map((key) => {
    if (!_.has(firstDataParsed, key)) {
      return {
        key,
        type: 'add',
        value: secondDataParsed[key],
      };
    }
    if (!_.has(secondDataParsed, key)) {
      return {
        key,
        type: 'del',
        value: firstDataParsed[key],
      };
    }
    if (firstDataParsed[key] === secondDataParsed[key]) {
      return {
        key,
        type: 'old',
        value: firstDataParsed[key],
      };
    }
    return {
      key,
      type: 'new',
      firstValue: firstDataParsed[key],
      secondValue: secondDataParsed[key],
    };
  });

  return differences;
};

const createTextDifferencesOutput = (differences) => {
  const output = differences.map((difference) => {
    switch (difference.type) {
      case 'add':
        return `  + ${difference.key}: ${difference.value}`;
      case 'del':
        return `  - ${difference.key}: ${difference.value}`;
      case 'old':
        return `    ${difference.key}: ${difference.value}`;
      case 'new':
        return `  - ${difference.key}: ${difference.firstValue}\n`
             + `  + ${difference.key}: ${difference.secondValue}`;
      default:
        throw new Error(`Unknown type: ${difference.type}`);
    }
  });

  return `{\n${output.join('\n')}\n}`;
};

const genDiff = (firstFileName, secondFileName) => {
  const firstFile = { path: getAbslPath(firstFileName) };
  firstFile.format = path.extname(firstFile.path).slice(1);
  firstFile.data = readFileSync(firstFile.path, 'utf-8');

  const secondFile = { path: getAbslPath(secondFileName) };
  secondFile.format = path.extname(secondFile.path).slice(1);
  secondFile.data = readFileSync(secondFile.path, 'utf-8');

  const filesDifferences = getDataDifferences(firstFile, secondFile);
  const outputDifferences = createTextDifferencesOutput(filesDifferences);

  return outputDifferences;
};
// console.log(genDiff('file1.json', 'file2.json'));
export default genDiff;
