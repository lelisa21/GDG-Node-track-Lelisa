import { createServer } from "node:http";
const port = 4000;
const students = [];
let id = 1;

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (data) => {
      body += data.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
}

const urlBy = req.url.split("/");
const method = req.method;
// GET
  if (method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Welcome to the Student API! Use /students for operations." }));
  }
   else if (method === "GET" && req.url === "/students") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(students));
  }
//   POST
   else if (method === "POST" && req.url === "/students") {
    try {
      const body = await getBody(req);
      const data = JSON.parse(body);
      if (!data.name) {
        res.statusCode = 400; // Bad Request
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Name is required!" }));
        return;
      }
      const newStud = { id: id++, name: data.name };
      students.push(newStud);
      res.statusCode = 201; // Created
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(newStud));
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  }
//   PUT
   else if (method === "PUT" && urlBy[1] === "students" && urlBy[2]) {
    const studentId = parseInt(urlBy[2], 10);
    try {
      const body = await getBody(req);
      const data = JSON.parse(body);
      if (!data.name) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Name is required!" }));
        return;
      }
      const student = students.find((stud) => stud.id === studentId);
      if (student) {
        student.name = data.name;
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(student));
      } else {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Student not found" }));
      }
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid JSON" }));
    }
  }
//   DELETE

   else if (method === "DELETE" && urlBy[1] === "students" && urlBy[2]) {
    const studentId = parseInt(urlBy[2], 10);
    const indexToBeDeleted = students.findIndex((stud) => stud.id === studentId);
    if (indexToBeDeleted !== -1) {
      students.splice(indexToBeDeleted, 1);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Student deleted" }));
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Student not found" }));
    }
  } 
//   NOT found
  else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
