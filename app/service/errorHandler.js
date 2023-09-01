const debug = require("debug")("errorHandler");
const { appendFile } = require("node:fs/promises");
const { join } = require("node:path");
const APIError = require("./APIError");

const errorHandler = {
  /**
   * Méthode de gestion d'erreur
   * @param {*} err
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async manage(err, req, res, next) {
    debug(err);
    // j'écris dans le fichier de logs
    errorHandler.log(err);

    // si je suis en dev, j'affiche l'erreur dans le terminal
    debug(err.error);

    // j'informe l'utilisateur
    res.status(err.code).json({ error: err.message });
  },
  /**
   * Méthode pour enregistrer les fichiers de logs
   * @param {*} err
   */
  async log(err) {
    const fileName = `${err.date.toISOString().slice(0, 10)}.log`;
    // chemin vers mon fichier de log
    const path = join(__dirname, `../../log/${fileName}`);
    debug(path);

    /*
            Nous allons logguer le moment où est survenue l'erreur, le message de celle-ci, la stacktrace ainsi que le contexte (par exemple le endpoint de notre API qui a conduit à l'erreur)

            un endpoint au niveau d'une API correspond à une route
        */

    const time = err.date.toISOString().slice(11, -1);
    let errorMessage;
    if (err.error) {
      errorMessage = err.error.message;
    } else {
      errorMessage = err.message;
    }
    const text = `${time};${errorMessage};${err.stack}\r\n`;
    // j'écris dans mon fichier de log
    await appendFile(path, text);
  },

  notFound(req, res, next) {
    const err = new APIError("Url not found !", 404);
    next(err);
  },
};

module.exports = errorHandler;
