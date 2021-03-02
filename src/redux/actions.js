import { 
  SET_INITIAL_LOADING_TO_FALSE,
  SET_TASKS, 
  SET_TASKS_DONE, 
  SET_TASKS_NOT_DONE, 
  SET_LOADING,
  SET_LIGHT_THEME,
  SET_DARK_THEME,
  SET_PORTUGUESE_LANGUAGE,
  SET_ENGLISH_LANGUAGE,
  SET_SELECTED_TASK,
  CLEAR_SELECTED_TASK,
  INCREASE_TASK_TIME_COUNTER,
  RESET_TASK_TIME_COUNTER,
} from './types';

const setInitialLoadingToFalse = () => {
  return {
    type: SET_INITIAL_LOADING_TO_FALSE,
  };
}

const setTasks = tasks => {
  return {
    type: SET_TASKS,
    tasks,
  };
}

const setTasksDone = tasksDone => {
  return {
    type: SET_TASKS_DONE,
    tasksDone,
  };
}

const setTasksNotDone = tasksNotDone => {
  return {
    type: SET_TASKS_NOT_DONE,
    tasksNotDone,
  };
}

const setLoading = isLoading => {
  return {
    type: SET_LOADING,
    isLoading,
  };
}

const setLightTheme = () => {
  return {
    type: SET_LIGHT_THEME,
    theme: 'L',
    screensBackgroundColor: '#f7f7f7',
    titlesAndIconsColor: '#585858',
    headerBackgroundColor: '#fff',
  };
}

const setDarkTheme = () => {
  return {
    type: SET_DARK_THEME,
    theme: 'D',
    screensBackgroundColor: '#0f1e25',
    titlesAndIconsColor: '#9ea3a9',
    headerBackgroundColor: '#232d36',
  };
}

const setPortugueseLanguage = () => {
  return {
    type: SET_PORTUGUESE_LANGUAGE,
    language: 'P',
  };
}

const setEnglishLanguage = () => {
  return {
    type: SET_ENGLISH_LANGUAGE,
    language: 'E',
  };
}

const setSelectedTask = selectedTask => {
  return {
    type: SET_SELECTED_TASK,
    selectedTask,
  };
}

const clearSelectedTask = () => {
  return {
    type: CLEAR_SELECTED_TASK,
  };
}

const increaseTaskTimeCounter = () => {
  return {
    type: INCREASE_TASK_TIME_COUNTER,
  };
}

const resetTaskTimeCounter = () => {
  return {
    type: RESET_TASK_TIME_COUNTER,
  };
}

const actionCreators = {
  setInitialLoadingToFalse,
  setTasks,
  setTasksDone,
  setTasksNotDone,
  setLoading,
  setLightTheme,
  setDarkTheme,
  setPortugueseLanguage,
  setEnglishLanguage,
  setSelectedTask,
  clearSelectedTask,
  increaseTaskTimeCounter,
  resetTaskTimeCounter,
};

export { actionCreators };
