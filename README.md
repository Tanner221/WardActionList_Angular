# Ward Action List

This repository contains two projects. Details of both projects can be found below

## Ward Action List API using MongoDb
To start the API locally, run the command `dotnet watch run` in the root directory. This will run the API on the default port of https://localhost:7132. The API consists of these actions:
* GET - Gets the Ward Actions from the database. Returns a list of actions
* GET/:id - Gets one action from the database
* POST - Creates a new action
* PUT/:id - Updates an action
* DELETE/:id - Deletes an action

## Ward Action List Frontend using Angular