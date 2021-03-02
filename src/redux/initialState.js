import Database from '../database/Database';

const database = new Database('my-tasks-db');
database.initDb();

const initialState = {
  databaseConnection: database.getDatabaseConnection(),
  isLoading: false,

  systemBlue: '#0f92d9',
  systemRed: '#ff6666',

  initialLoading: true,
  theme: 'L',
  language: 'P',

  screensBackgroundColor: '#f7f7f7',
  titlesAndIconsColor: '#585858',
  headerBackgroundColor: '#fff',

  tasks: [],
  tasksDone: [],
  tasksNotDone: [],

  selectedTask: {},
  taskTimeCounter: 0,
};

export default initialState;
