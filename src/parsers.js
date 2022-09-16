import { load as YMLParse } from 'js-yaml';

const parseData = (data, format) => {
  switch (format) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
    case 'yml':
      return YMLParse(data);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};

export default parseData;
