import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';

const getAbslPath = (fileName) => path.resolve(process.cwd(), fileName);

const parseFile = (file) => JSON.parse(file);

const getDataDifferences = (firstFileData, secondFileData) => {
  const firstDataParsed = parseFile(firstFileData);
  const firstDataKeys = _.keys(firstDataParsed);

  const secondDataParsed = parseFile(secondFileData);
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
  const firstFilePath = getAbslPath(firstFileName);
  const firstFileData = readFileSync(firstFilePath, 'utf-8');

  const secondFilePath = getAbslPath(secondFileName);
  const secondFileData = readFileSync(secondFilePath, 'utf-8');

  const differences = getDataDifferences(firstFileData, secondFileData);
  const differencesOutput = createTextDifferencesOutput(differences);

  return differencesOutput;
};

export default genDiff;
