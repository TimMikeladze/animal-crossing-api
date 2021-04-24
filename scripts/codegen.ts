import excelToJson from 'convert-excel-to-json';
import camelcase from 'camelcase';

import { snakeCase } from 'snake-case';

require('dotenv').config();

const result = excelToJson({
  sourceFile: 'data/Data Spreadsheet for Animal Crossing New Horizons.xlsx',
});

const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  },
  searchPath: ['public'],
});

const normalizeKey = (key) => {
  let newKey = (key.replace('/', '').replace('$', '').replace('?', '').replace(' ', '')
    .replace('(', '')
    .replace(')', ''));
  if (newKey.startsWith('#')) {
    newKey = newKey.replace('#', 'number');
  }

  return camelcase(newKey);
};

(async () => {
  await Promise.all(Object.keys(result).filter((sheetName) => sheetName !== 'Read Me').map(async (sheetName) => {
    const sheetRows = result[sheetName];
    const sheetHeaderRow = sheetRows[0];

    const newSheetRows = sheetRows.splice(1).reduce((allRows, currentRow) => {
      const mapped = Object.keys(currentRow).reduce((res, key) => {
        let id;

        if (sheetHeaderRow[key] === 'Unique Entry ID') {
          id = currentRow[key];
        }

        const rowData = ({
          ...res,
          [normalizeKey(sheetHeaderRow[key])]: currentRow[key],
          id,
        });

        return rowData;
      }, {});

      return [
        ...allRows,
        mapped,
      ];
    }, []);

    const columns = Object.values(sheetHeaderRow).map((x) => normalizeKey(x));
    columns.push('id');

    const tableName = snakeCase(sheetName);

    await knex.schema.dropTableIfExists(tableName);

    if (!(await knex.schema.hasTable(tableName))) {
      await knex.schema.createTable(tableName, (table) => {
        columns.forEach((column) => {
          // const hasNumericValue = !!newSheetRows.find((x) => !Number.isNaN(Number(x[column])));

          // if (hasNumericValue) {
          //   table.decimal(column).defaultTo(0);
          // } else {
          //   table.string(column);
          // }

          if (column === 'id') {
            table.string('id');
          } else {
            table.text(column);
          }
        });

        table.primary(['id']);
      });
    }

    for (const row of newSheetRows) {
      await knex(tableName).insert(row);
    }
  }));

  console.log('Finished');

  process.exit(0);
})();
