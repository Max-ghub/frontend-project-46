import _ from 'lodash';
// spC - spaces count

const doIntd = (depth, spC = 4) => ' '.repeat(depth * spC - 2);

const getValue = (value, depth, spC) => {
  const iter = (itrValue, itrDepth) => {
    if (!_.isObject(itrValue)) {
      return itrValue;
    }
    const itrData = Object.entries(itrValue);
    const output = itrData.map(([itrDataKey, itrDataValue]) => {
      if (!_.isObject(itrDataValue)) {
        return `${' '.repeat(spC * (itrDepth + 1))}${itrDataKey}: ${itrDataValue}`;
      }
      return `${' '.repeat(spC * (itrDepth + 1))}${itrDataKey}: ${iter(itrDataValue, itrDepth + 1)}`;
    });
    return `{\n${output.join('\n')}\n${' '.repeat(spC * itrDepth)}}`;
  };

  return iter(value, depth);
};

const getStylishFormat = (differences) => {
  const iter = (differencesData, depth, spC = 4) => {
    const stylishOutput = differencesData.flatMap(({ key, type, value }) => {
      switch (type) {
        case 'obj':
          return `${doIntd(depth)}  ${key}: ${iter(value, depth + 1, spC)}`;
        case 'add':
          return `${doIntd(depth)}+ ${key}: ${getValue(value, depth, spC)}`;
        case 'del':
          return `${doIntd(depth)}- ${key}: ${getValue(value, depth, spC)}`;
        case 'old':
          return `${doIntd(depth)}  ${key}: ${getValue(value, depth, spC)}`;
        case 'new':
          return `${doIntd(depth)}- ${key}: ${getValue(value.first, depth, spC)}\n`
               + `${doIntd(depth)}+ ${key}: ${getValue(value.second, depth, spC)}`;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    });

    return `{\n${stylishOutput.join('\n')}\n${' '.repeat(depth * spC - 4)}}`;
  };

  const depth = 1;
  const spC = 4;
  return iter(differences, depth, spC);
};

export default getStylishFormat;
