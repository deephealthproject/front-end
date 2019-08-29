# DeepHealth

## Manual build and run using just Nodejs
Prerequisites<br />
You need to have Nodejs 8 or up installed in your setup.
You need to have Angular Cli version 7.3.9 by command: <br />
npm install -g @angular/cli@7.3.9

In folder where angular.json and package.json exist run next commands:<br />
1 - to install node_modules libraries:<br />
npm install

2 - to build application and start angular default server:<br />
ng serve

3 - access in browser:<br />
http://localhost:4200

## Manual build and run using Apache Tomcat server - the best way for better compressing target files
Prerequisites<br />
You need to have Nodejs 8 or up installed in your setup.
You need to have Angular Cli version 7.3.9 by command: <br />
npm install -g @angular/cli@7.3.9<br />
You need to have installed Java 8 and JAVA_HOME environment variable for the innstalled java 8 set.<br />
You need to have binary Apache Tomcat 8 server.

In folder where angular.json and package.json exist run next commands:<br />
1 - to install node_modules libraries:<br />
npm install

2 - to build the project / create target files for production mode - best compressing target files:<br />
ng build --base-href "." --prod 

3 - deploy application:<br />
The build command will create a /dist folder that contains target /deep-health folder with compiled files<br />
Copy /deep-health folder in root /apache-tomcat8/webapps/

4 - to start Tomcat server<br />
In Tomcat root folder, in /bin run startup.bat(for Windows) or startup.sh(for Linux)

5 - access in browser:<br />
default Tomcat start on port 8080, access:<br />
http://localhost:8080/deep-health


## Docker compose build and run

Prerequisites<br />
You need to have docker and docker-compose installed in your setup.<br />
You need to have Nodejs 8 or up installed in your setup.<br />
Node js will install (by docker config) Angular Cli 7.3.9<br />
														
1 - start Docker - make sure docker is in running status<br />
														
2 - Verify:<br />
$ docker  -v<br />
Docker version 18.09.2, build 6247962

$ docker-compose -v<br />
docker-compose version 1.23.2, build 1110ad01

$ node -v<br />
v8.11.3

3 - build the docker image and the application:<br />
docker build -t deep-health:prod .

4 - run docker image:<br />
docker run -d --name deep-health -p 4200:4200 deep-health:prod

5 - access the application in browser on port 4200<br />
http://localhost:4200

6 - administration steps:<br />

 - stop - in case you want to stop docker image:<br />
docker stop deep-health

 - start - in case you want to start the stopped docker image:<br />
docker start deep-health

- to have a status - view running docker images:<br />
 docker ps -a

- remove imagine docker in case of image running problems, remove the image with deep-health name(using the ID) and repeat the above steps:<br />
EX: docker rm a09e5b182263
