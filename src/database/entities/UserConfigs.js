import GenericEntity from "./GenericEntity";

class UserConfigs extends GenericEntity {
  create(databaseConnection) {
    const fields = [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      "theme CHARACTER(1) DEFAULT 'L'",
      "language CHARACTER(1) DEFAULT 'P'",
    ];

    this.createTable('user_configs', fields, databaseConnection);
  }

  drop(databaseConnection) {
    this.dropTable('user_configs', databaseConnection);
  }
}

export default UserConfigs;
