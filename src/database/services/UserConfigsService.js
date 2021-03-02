import GenericService from "./GenericService";

class UserConfigsService extends GenericService {
  insertTheme(databaseConnection, callback) {
    const insertThemeSql = `
      INSERT INTO user_configs (theme)
      VALUES ('L');
    `;

    this.executeQuery(
      databaseConnection,
      insertThemeSql,
      '[THEME INSERT WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO INSERT THEME]',
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

  changeTheme(databaseConnection, theme, callback) {
    const changeThemeSql = `
      UPDATE user_configs SET
        theme = '${theme}';
    `;

    this.executeQuery(
      databaseConnection,
      changeThemeSql,
      '[THEME CHANGE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO CHANGE THEME]',
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
  
  getTheme(databaseConnection, callback) {
    const getThemeSql = `
      SELECT theme
      FROM user_configs
    `;

    this.executeQuery(
      databaseConnection,
      getThemeSql,
      '[THEME SELECT WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO SELECT THEME]',
      i => {
        console.log('from db:', i);
        if (callback) {
          let value = '';
          
          if (i.rows.item(0)) {
            value = i.rows.item(0).theme;
          }

          callback({ status: true, data: value });
        }
      },
      () => {
        if (callback) {
          callback({ status: true, data: '' });
        }
      }
    );
  }

  insertLanguage(databaseConnection, callback) {
    const insertlanguageSql = `
      INSERT INTO user_configs (language)
      VALUES ('P');
    `;

    this.executeQuery(
      databaseConnection,
      insertlanguageSql,
      '[LANGUAGE INSERT WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO INSERT LANGUAGE]',
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

  changeLanguage(databaseConnection, language, callback) {
    const changelanguageSql = `
      UPDATE user_configs SET
        language = '${language}';
    `;

    this.executeQuery(
      databaseConnection,
      changelanguageSql,
      '[LANGUAGE CHANGE WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO CHANGE LANGUAGE]',
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

  getLanguage(databaseConnection, callback) {
    const getlanguageSql = `
      SELECT language
      FROM user_configs
    `;

    this.executeQuery(
      databaseConnection,
      getlanguageSql,
      '[LANGUAGE SELECT WAS SUCCESS]',
      '[AN ERROR OCCURS WHEN TRYING TO SELECT LANGUAGE]',
      i => {
        console.log('from db:', i);
        if (callback) {
          let value = '';

          if (i.rows.item(0)) {
            value = i.rows.item(0).language;
          }

          callback({ status: true, data: value });
        }
      },
      () => {
        if (callback) {
          callback({ status: true, data: '' });
        }
      }
    );
  }

}

export default UserConfigsService;
