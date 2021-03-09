import { changeFavoriteStatus, favoriteNumbersExceeded } from "../../utils/Errors";
import GenericService from "./GenericService";

class TaskService extends GenericService {
  insertTaskOnDatabase(databaseConnection, task, callback) {
    const insertTaskSql = `
      INSERT INTO task (title, annotation, date, hour, alarm, color)
      VALUES (
        '${task.title}'
        ,'${task.annotation}' 
        ,'${task.date}' 
        ,'${task.hour}' 
        ,'${task.alarm}'
        ,'${task.color}' 
      );
    `;

    this.executeQuery(
      databaseConnection,
      insertTaskSql,
      '[TASK INSERT WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO INSERT TASK]',
      e => {
        if (callback) {
          callback({ status: true, data: e.insertId });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  updateTask(databaseConnection, task, callback) {
    const updateTaskSql = `
      UPDATE task SET
        title = '${task.title}'
        ,annotation = '${task.annotation}' 
        ,date = '${task.date}' 
        ,hour = '${task.hour}' 
        ,alarm = '${task.alarm}'
        ,color = '${task.color}'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${task.id}; 
    `;

    this.executeQuery(
      databaseConnection,
      updateTaskSql,
      '[TASK UPDATE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE TASK]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  inactivateTask(databaseConnection, id, callback) {
    const inactivateTaskSql = `
      UPDATE task SET
        deleted = 'Y'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    this.executeQuery(
      databaseConnection,
      inactivateTaskSql,
      '[TASK INACTIVATION WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO INACTIVATE TASK]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  cloneTask(databaseConnection, task, callback) {
    const cloneTaskSql = `
      INSERT INTO task (title, annotation, date, hour, alarm, color)
      VALUES (
        '${task.title}'
        ,'${task.annotation}' 
        ,'${task.date}' 
        ,'${task.hour}' 
        ,'${task.alarm}'
        ,'${task.color}' 
      );
    `;

    this.executeQuery(
      databaseConnection,
      cloneTaskSql,
      '[CLONE TASK WAS SUCCESS]',
      '[AN ERROR OCCURS ON TRYING TO CLONE TASK]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  changeTaskFavoriteStatus(databaseConnection, id, favorite, callback) {
    if (favorite === 'Y') {
      const verifyQuantityOfFavoriteTasksSql = `
        SELECT COUNT(id) AS quantity
        FROM task
        WHERE status = 'O'
          AND deleted = 'N'
          AND favorite = 'Y';
      `;
  
      this.executeQuery(
        databaseConnection,
        verifyQuantityOfFavoriteTasksSql,
        '',
        '',
        e => {
          console.log('rfttersdetsst:', e);
          if (e.rows.item(0).quantity > 2 && callback) {
            callback({ 
              status: false,
              error: favoriteNumbersExceeded,
            });
          } else {
            const taskFavoriteStatusSql = `
              UPDATE task SET
                favorite = '${favorite}' 
                ,updated_at = CURRENT_TIMESTAMP
              WHERE id = ${id};
            `;

            this.executeQuery(
              databaseConnection,
              taskFavoriteStatusSql,
              '[UPDATE FAVORITE STATUS WAS SUCCESS]',
              '[AN ERROR OCCURS WHEN TRYING TO UPDATE FAVORITE STATUS]',
              () => {
                if (callback) {
                  callback({ status: true });

                  return
                }
              },
              () => {
                if (callback) {
                  callback({
                    status: false,
                    error: changeFavoriteStatus,
                  });

                  return
                }
              },
            );
          }
        },
        () => {
          if (callback) {
            callback({ 
              status: false,
              error: changeFavoriteStatus, 
            });
          }
        },
      );
    } else {
      const taskFavoriteStatusSql = `
        UPDATE task SET
          favorite = '${favorite}' 
          ,updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id};
      `;

      this.executeQuery(
        databaseConnection,
        taskFavoriteStatusSql,
        '[UPDATE FAVORITE STATUS WAS SUCCESS]',
        '[AN ERROR OCCURS WHEN TRYING TO UPDATE FAVORITE STATUS]',
        () => {
          if (callback) {
            callback({ status: true });

            return
          }
        },
        () => {
          if (callback) {
            callback({
              status: false,
              error: changeFavoriteStatus,
            });

            return
          }
        },
      );
    }
  }

  markTaskAsOpen(databaseConnection, id, callback) {
    const markTaskStatusAsOpenSql = `
      UPDATE task SET
        status = 'O'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    this.executeQuery(
      databaseConnection,
      markTaskStatusAsOpenSql,
      '[UPDATE STATUS TO OPEN WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE STATUS TO OPEN]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  markTaskAsDone(databaseConnection, id, callback) {
    const markTaskStatusAsDoneSql = `
      UPDATE task SET
        status = 'D'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    this.executeQuery(
      databaseConnection,
      markTaskStatusAsDoneSql,
      '[UPDATE STATUS TO DONE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE STATUS TO DONE]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  markTaskAsNotDone(databaseConnection, id, callback) {
    const markTaskStatusAsNotDoneSql = `
      UPDATE task SET
        status = 'N'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    this.executeQuery(
      databaseConnection,
      markTaskStatusAsNotDoneSql,
      '[UPDATE STATUS TO DONE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE STATUS TO NOT DONE]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }
  
  updateWorkingTime(databaseConnection, id, workingTime, callback) {
    const updateWorkingTimeSql = `
      UPDATE task SET
        working_time = ${workingTime}
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
  
    this.executeQuery(
      databaseConnection,
      updateWorkingTimeSql,
      '[UPDATE WORKIN_TIME WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE WORKING_TIME]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  setNotificationCode(databaseConnection, id, notificationCode, callback) {
    const setNotificationCodeSql = `
      UPDATE task SET
        notification_code = '${notificationCode}'
        ,updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    this.executeQuery(
      databaseConnection,
      setNotificationCodeSql,
      '[UPDATE NOTIFICATION_CODE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO UPDATE NOTIFICATION_CODE]',
      () => {
        if (callback) {
          callback({ status: true });
        }
      },
      () => {
        if (callback) {
          callback({ status: false });
        }
      },
    );
  }

  getAllTasks(databaseConnection, status = 'O', callback) {
    const getAllTasksSql = `
      SELECT id 
        ,title
        ,annotation
        ,date
        ,hour
        ,color
        ,alarm
        ,favorite
        ,status
        ,working_time
      FROM task
      WHERE status = '${status}' 
        AND deleted = 'N'
      ORDER BY ${status === 'O' ? "favorite = 'N'" : 'id'};
    `;

    this.executeQuery(
      databaseConnection,
      getAllTasksSql,
      '[SELECT OF ALL TASKS WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO FETCH ALL TASKS]',
      i => {
        const tasks = [];

        for (let index = 0; index < i.rows.length; index++) {
          tasks.push(i.rows.item(index));
        }

        if (callback) {
          callback({ status: true, data: tasks });
        }
      },
      () => {
        if (callback) {
          callback({ status: true, data: [] });
        }
      }
    );
  }
}

export default TaskService;
