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
      const differences = {
        key,
        type: 'obj',
        value: getDataDifferences(firstData[key], secondData[key]),
      };
      return differences;
    }
    if (!_.has(firstData, key)) {
      const differences = {
        key,
        type: 'add',
        value: secondData[key],
      };
      return differences;
    }
    if (!_.has(secondData, key)) {
      const differences = {
        key,
        type: 'del',
        value: firstData[key],
      };
      return differences;
    }
    if (firstData[key] === secondData[key]) {
      const differences = {
        key,
        type: 'old',
        value: firstData[key],
      };
      return differences;
    }
    const differences = {
      key,
      type: 'new',
      value: {
        first: firstData[key],
        second: secondData[key],
      },
    };
    return differences;
  });

  return differences;
};

const genDiff = (firstFileName, secondFileName, format = 'stylish') => {
  const firstFilePath = getAbslPath(firstFileName);
  const firstFileData = readFileSync(firstFilePath, 'utf-8');
  const firstFileFormat = path.extname(firstFilePath).slice(1);
  const firstFileParsedData = parseData(firstFileData, firstFileFormat);

  const secondFilePath = getAbslPath(secondFileName);
  const secondFileData = readFileSync(secondFilePath, 'utf-8');
  const secondFileFormat = path.extname(secondFilePath).slice(1);
  const secondFileParsedData = parseData(secondFileData, secondFileFormat);

  const filesDifferences = getDataDifferences(firstFileParsedData, secondFileParsedData);

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
