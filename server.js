// import app export with our server info
import app from './app';

// set port number for server to run on
app.set("port", 3001);

// start up server on given port and console log message that server is running
app.listen(app.get("port"), () => {
  console.log(`App is running on http://localhost:${app.get("port")}.`)
});