
class GenericService {
  executeQuery(databaseConnection, sql, successLog, errorLog, successCallback, errorCallback) {
    return databaseConnection.transaction(tx => {
      tx.executeSql(sql, [], (e, i) => {
        console.log(successLog);

        if (successCallback) {
          successCallback(i);
        }
      }, e => {
        console.log(errorLog, e);

        if (errorCallback) {
          errorCallback(e);
        }
      });
    });
  }
}

export default GenericService;
