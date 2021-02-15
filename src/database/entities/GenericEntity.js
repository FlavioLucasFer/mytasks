class GenericEntity {
  createTable(tableName, fields, databaseConnection) {
    let columns = '';
    
    fields.forEach((column, index) => {
      columns += `${index > 0 ? ',' : ''}${column}\n`;
    });


    let createTableSql = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columns}
      );
    `;

    databaseConnection.transaction(tx => {
      tx.executeSql(createTableSql, [], () => {
        console.log(`["${tableName}" TABLE CREATED SUCCESSFULLY]`);
      }, e => {
        console.log(`[ERROR ON "${tableName}" TABLE CREATION]`);
        console.log('[ERROR]: \n', e);
      });
    });
  };

  dropTable(tableName, databaseConnection) {
    const dropTableSql = `DROP TABLE ${tableName};`;

    databaseConnection.transaction(tx => {
      tx.executeSql(dropTableSql, [], () => {
        console.log(`["${tableName}" TABLE DROPPED SUCCESSFULLY]`);
      }, e => {
        console.log(`[DROPPED ON "${tableName}" TABLE CREATION]`);
        console.log('[ERROR]: \n', e);
      });
    });
  }
};

export default GenericEntity;
