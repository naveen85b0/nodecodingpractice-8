const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};
//------------------------------------------------------------
// Get Movie API 1 scenario 1
/*
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  let statussplit = status.split("%20").join(" ");
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}'
      ;`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});

//scenario 2

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where priority ='${priority}';`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});

//---------------------

//3
app.get("/todos/", async (request, response) => {
  const { status, priority } = request.query;
  let statussplit = status.split("%20").join(" ");
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}' and priority = '${priority}'
      ;`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});

//-----------------------------------

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  let statussplit = status.split("%20").join(" ");
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where  todo like '%${search_q}%' 
     ;`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});

//------------------------------------------------------------------------------------------
*/
// API2

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todoResponse = await db.get(getTodoQuery);

  response.send(todoResponse);
});

//API3

app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const addTodoQuery = `INSERT INTO
      todo (id,todo,priority,status)
    VALUES
      (
        ${id},
       '${todo}',
       '${priority}',
       '${status}'
        
      );`;

  const dbResponse = await db.run(addTodoQuery);

  response.send("Todo Successfully Added");
});

//================================

/*
app.get("/todos/", async (request, response) => {
  const { status, priority } = request.query;
  let statussplit = status.split("%20").join(" ");
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}' and priority = '${priority}'
      ;`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});

//==================================================

app.get("/todos/", async (request, response) => {
  const { id = "", search_q = "", priority = "", status = "" } = request.query;
  let statussplit = status.split("%20").join(" ");
  const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}' or priority='${priority}' or todo like '%${search_q}%'
      ;`;
  const dbResponse = await db.all(getTodoQuery);
  response.send(dbResponse);
});
*/
//==================================
//testing is right answer
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority = "", status = "" } = request.query;
  let statussplit = status.split("%20").join(" ");
  if (priority != "" && status != "") {
    const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}' and priority = '${priority}'
      ;`;
    const dbResponse = await db.all(getTodoQuery);
    response.send(dbResponse);
  } else if (status != "") {
    const getTodoQuery = `SELECT
      *
    FROM
      todo
      where status ='${statussplit}' 
      
      ;`;
    const dbResponse = await db.all(getTodoQuery);
    response.send(dbResponse);
  } else if (search_q != "") {
    const getTodoQuery = `SELECT
      *
    FROM
      todo
      where  todo like '%${search_q}%'
      
      ;`;
    const dbResponse = await db.all(getTodoQuery);
    response.send(dbResponse);
  } else {
    const getTodoQuery = `SELECT
      *
    FROM
      todo
      where priority='${priority}' 
      
      ;`;
    const dbResponse = await db.all(getTodoQuery);
    response.send(dbResponse);
  }
});

//-----------------------------------------------------------------
//API 4
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status, priority, todo } = todoDetails;
  if (priority != undefined) {
    const updateTodo = `
  update todo set 
  priority = '${priority}'
  
  where id = ${todoId};
  `;
    const dbResponse = await db.run(updateTodo);
    response.send("Priority Updated");
  } else if (status != undefined) {
    const updateTodo = `
  update todo set 
  status = '${status}'
  
  where id = ${todoId};
  `;
    const dbResponse = await db.run(updateTodo);
    response.send("Status Updated");
  } else {
    const updateTodo = `
  update todo set 
  todo = '${todo}'
  
  where id = ${todoId};
  `;
    const dbResponse = await db.run(updateTodo);
    response.send("Todo Updated");
  }
});

//API5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuary = `
    delete from todo where id = ${todoId};
    `;
  await db.run(deleteTodoQuary);
  response.send("Todo Deleted");
});

module.exports = app;
