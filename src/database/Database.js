import * as SQLite from 'expo-sqlite';
import Task from './entities/Task';

class Database {
  databaseConnection;

  constructor(databaseName) {
    this.databaseConnection = SQLite.openDatabase(databaseName, null, null, null, () => {
      console.log(`[CONNECTED TO "${databaseName}" DATABASE]`);
    });
  }
  
  getDatabaseConnection() {
    return this.databaseConnection;
  }

  initDb() {
    const task = new Task();

    // task.drop(this.databaseConnection);
    task.create(this.databaseConnection);
  }

};

export default Database;