import {
  SET_INITIAL_LOADING_TO_FALSE,
  SET_TASKS,
  SET_TASKS_DONE,
  SET_TASKS_NOT_DONE,
  SET_LOADING,
  SET_LIGHT_THEME,
  SET_DARK_THEME,
  SET_ENGLISH_LANGUAGE,
  SET_PORTUGUESE_LANGUAGE,
  SET_SELECTED_TASK,
  CLEAR_SELECTED_TASK,
  INCREASE_TASK_TIME_COUNTER,
  RESET_TASK_TIME_COUNTER,
  SET_MORE_SECONDS_TO_TASK_TIME_COUNTER,
} from './types';
import initialState from './initialState';

const setInitialLoadingToFalse = (state) => {
  return {
    ...state,
    initialLoading: false,
  };
};

const setTasks = (state, tasks) => {
  return {
    ...state,
    tasks,
  };
};

const setTasksDone = (state, tasksDone) => {
  return {
    ...state,
    tasksDone,
  };
};

const setTasksNotDone = (state, tasksNotDone) => {
  return {
    ...state,
    tasksNotDone,
  };
};

const setLoading = (state, isLoading) => {
  return {
    ...state,
    isLoading,
  };
};

const setTheme = (state, screensBackgroundColor, 
  titlesAndIconsColor, headerBackgroundColor, theme) => {

  return {
    ...state,
    screensBackgroundColor,
    titlesAndIconsColor,
    headerBackgroundColor,
    theme,
  };
};

const setLanguage = (state, language) => {
  return {
    ...state,
    language,
  };
}

const setSelectedTask = (state, selectedTask) => {
  return {
    ...state,
    selectedTask,
  };
}

const clearSelectedTask = state => {
  return {
    ...state,
    selectedTask: {},
  };
}

const increaseTaskTimeCounter = state => {
  return {
    ...state,
    taskTimeCounter: state.taskTimeCounter + 1,
  };
}


const resetTaskTimeCounter = state => {
  return {
    ...state,
    taskTimeCounter: 0,
  };
}

const setMoreSecondsToTaskTimeCounter = (state, seconds) => {
  return {
    ...state,
    taskTimeCounter: state.taskTimeCounter + seconds,
  };
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_INITIAL_LOADING_TO_FALSE:
      return setInitialLoadingToFalse(state);
      
    case SET_TASKS:
      return setTasks(state, action.tasks);
  
    case SET_TASKS_DONE:
      return setTasksDone(state, action.tasksDone);
    
    case SET_TASKS_NOT_DONE:
      return setTasksNotDone(state, action.tasksNotDone);

    case SET_LOADING:
      return setLoading(state, action.isLoading);

    case SET_LIGHT_THEME:
      return setTheme(state, action.screensBackgroundColor,
        action.titlesAndIconsColor, action.headerBackgroundColor, action.theme);
    
    case SET_DARK_THEME:
      return setTheme(state, action.screensBackgroundColor,
        action.titlesAndIconsColor, action.headerBackgroundColor, action.theme);

    case SET_PORTUGUESE_LANGUAGE:
      return setLanguage(state, action.language);

    case SET_ENGLISH_LANGUAGE: 
      return setLanguage(state, action.language);

    case SET_SELECTED_TASK: 
      return setSelectedTask(state, action.selectedTask);

    case CLEAR_SELECTED_TASK:
      return clearSelectedTask(state);

    case INCREASE_TASK_TIME_COUNTER:
      return increaseTaskTimeCounter(state);

    case RESET_TASK_TIME_COUNTER:
      return resetTaskTimeCounter(state);

    case SET_MORE_SECONDS_TO_TASK_TIME_COUNTER:
      return setMoreSecondsToTaskTimeCounter(state, action.seconds);

    default:
      return state;
  }
}

export default reducer;
