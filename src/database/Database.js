import * as SQLite from 'expo-sqlite';
import Task from './entities/Task';
import UserConfigs from './entities/UserConfigs';

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
    const userConfig = new UserConfigs();

    // task.drop(this.databaseConnection);
    task.create(this.databaseConnection);
    // userConfig.drop(this.databaseConnection);
    userConfig.create(this.databaseConnection);
  }

};

export default Database;
