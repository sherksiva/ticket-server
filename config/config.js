/*
 * Author : Balakrishnan
 * Created Date : 5th November 2019
 * Last Updated Date : 6th September 2020
 * Last Updated Author : Balakrishnan
 * 
 * Description : Config file which is handling all the application properties
 * 
 */


import properties from "./app-properties";

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require("dotenv").config();

const appProps = properties.properties;

const config = {
  env: 'development',
  port: appProps.API_PORT,
};

export default config;
