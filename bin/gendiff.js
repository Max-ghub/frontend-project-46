#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '../src/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1 <filepath2>')
  .action((filepath1, filepath2) => {
    const differenseOutput = genDiff(filepath1, filepath2, program.opts().format);
    console.log(differenseOutput);
  });

program.parse();
