import GenericEntity from "./GenericEntity";

class Task extends GenericEntity {
  create(databaseConnection) {
    const fields = [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'title VARCHAR(50)',
      'annotation VARCHAR(255)',
      'date VARCHAR(50)',
      'hour CHARACTER(5)',
      // If the card is marked as favorite: Y - Yes | N - No
      "favorite CHARACTER(1) DEFAULT 'N'",
      // If task is open, done or not done: O - Open | D - Done | N - Not done
      "status CHARACTER(1) DEFAULT 'O'",
      // If should by alarm: Y - Yes | N - No
      "alarm CHARACTER(1) DEFAULT 'Y'",
      'notification_code VARCHAR(255)',
      "color VARCHAR(10) DEFAULT 'lightgreen'",
      "working_time INTEGER DEFAULT 0",
      
      // If task was deleted: Y - Yes | N - No
      "deleted CHARACTER(1) DEFAULT 'N'",
      'created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
      'updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    ];

    this.createTable('task', fields, databaseConnection);
  }

  drop(databaseConnection) {
    this.dropTable('task', databaseConnection);
  }
}

export default Task;
