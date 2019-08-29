# DeepHealth

## Manual build and run using just Nodejs
Prerequisites
You need to have Nodejs 8 or up installed in your setup.
You need to have Angular Cli version 7.3.9 by command: 
npm install -g @angular/cli@7.3.9

In folder where angular.json and package.json exist run next commands:
1 - to install node_modules libraries:
npm install

2 - to build application and start angular default server:
ng serve

3 - access in browser:
http://localhost:4200

## Manual build and run using Apache Tomcat server - the best way for better compressing target files
Prerequisites
You need to have Nodejs 8 or up installed in your setup.
You need to have Angular Cli version 7.3.9 by command: 
npm install -g @angular/cli@7.3.9
You need to have installed Java 8 and JAVA_HOME environment variable for the innstalled java 8 set.
You need to have binary Apache Tomcat 8 server.

In folder where angular.json and package.json exist run next commands:
1 - to install node_modules libraries:
npm install

2 - to build the project / create target files for production mode - best compressing target files:
ng build --base-href "." --prod 

3 - deploy application:
The build command will create a /dist folder that contains target /deep-health folder with compiled files
Copy /deep-health folder in root /apache-tomcat8/webapps/

4 - to start Tomcat server
In Tomcat root folder, in /bin run startup.bat(for Windows) or startup.sh(for Linux)
ng serve

5 - access in browser:
default Tomcat start on port 8080, access:
http://localhost:8080/deep-health


## Docker compose build and run

Prerequisites
You need to have docker and docker-compose installed in your setup.
You need to have Nodejs 8 or up installed in your setup.
Node js will install (by docker config) Angular Cli 7.3.9
														
1 - start Docker - make sure docker is in running status
														
2 - Verify:
$ docker  -v
Docker version 18.09.2, build 6247962

$ docker-compose -v
docker-compose version 1.23.2, build 1110ad01

$ node -v
v8.11.3

3 - build the docker image and the application:
docker build -t deep-health:prod .

4 - run docker image:
docker run -d --name deep-health -p 4200:4200 deep-health:prod

5 - access the application in browser on port 4200
http://localhost:4200

6 - administration steps:

 - stop - in case you want to stop docker image:
docker stop deep-health

 - start - in case you want to start the stopped docker image:
docker start deep-health

- to have a status - view running docker images:
 docker ps -a

- remove imagine docker in case of image running problems, remove the image with deep-health name(using the ID) and repeat the above steps:
EX: docker rm a09e5b182263
