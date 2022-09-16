import path from 'node:path';
import { readFileSync } from 'node:fs';
import _ from 'lodash';
import parseData from './parsers.js';
import getStylishFormat from './formatters/stylish.js';
import getPlainFromat from './formatters/plain.js';

// const getAbslPath = (fileName) => path
//   .resolve(process.cwd(), `__fixtures__/${fileName}`); // +Debug
const getAbslPath = (fileName) => path.resolve(process.cwd(), fileName); // -Debug

const getDataDifferences = (firstData, secondData) => {
  const firstDataKeys = _.keys(firstData);
  const secondDataKeys = _.keys(secondData);

  const unionDataKeys = _.union(firstDataKeys, secondDataKeys);
  const sortedDataKeys = _.sortBy(unionDataKeys);

  const differences = sortedDataKeys.map((key) => {
    if (_.isPlainObject(firstData[key]) && _.isPlainObject(secondData[key])) {
      return {
        key,
        type: 'obj',
        value: getDataDifferences(firstData[key], secondData[key]),
      };
    }
    if (!_.has(firstData, key)) {
      return {
        key,
        type: 'add',
        value: secondData[key],
      };
    }
    if (!_.has(secondData, key)) {
      return {
        key,
        type: 'del',
        value: firstData[key],
      };
    }
    if (firstData[key] === secondData[key]) {
      return {
        key,
        type: 'old',
        value: firstData[key],
      };
    }
    return {
      key,
      type: 'new',
      value: {
        first: firstData[key],
        second: secondData[key],
      },
    };
  });

  return differences;
};

const genDiff = (firstFileName, secondFileName, format = 'stylish') => {
  const firstFile = {};
  firstFile.path = getAbslPath(firstFileName);
  firstFile.format = path.extname(firstFile.path).slice(1);
  firstFile.data = readFileSync(firstFile.path, 'utf-8');
  firstFile.parsedData = parseData(firstFile);

  const secondFile = {};
  secondFile.path = getAbslPath(secondFileName);
  secondFile.format = path.extname(secondFile.path).slice(1);
  secondFile.data = readFileSync(secondFile.path, 'utf-8');
  secondFile.parsedData = parseData(secondFile);

  const filesDifferences = getDataDifferences(firstFile.parsedData, secondFile.parsedData);

  switch (format) {
    case 'stylish':
      return getStylishFormat(filesDifferences);
    case 'plain':
      return getPlainFromat(filesDifferences);
    case 'json':
      return JSON.stringify(filesDifferences);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};

// console.log(genDiff('file1.json', 'file2.json', 'plain')); // +Debug
export default genDiff;
