import _ from 'lodash';

const getValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return _.isString(value) ? `'${value}'` : value;
};

const getPlainFromat = (differences) => {
  const iter = (differencesData, tree = []) => {
    const outputPlain = differencesData
      .map(({ key, type, value }) => {
        const outputTree = _.concat(tree, key);
        switch (type) {
          case 'old':
            return '';
          case 'obj':
            return iter(value, outputTree);
          case 'add':
            return [`Property '${outputTree.join('.')}' was added with value: ${getValue(value)}`];
          case 'del':
            return [`Property '${outputTree.join('.')}' was removed`];
          case 'new':
            return [`Property '${outputTree.join('.')}' was updated. From ${getValue(value.first)} to ${getValue(value.second)}`];
          default:
            throw new Error(`Unknown type: ${type}`);
        }
      })
      .filter((outputElem) => outputElem !== '');

    return `${outputPlain.join('\n')}`;
  };

  return iter(differences);
};

export default getPlainFromat;
