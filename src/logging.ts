import * as log4js from "log4js";
log4js.configure("./log4js-setting.json");

export const LOGGER = log4js.getLogger("app");