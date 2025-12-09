import { createServer } from "http";
const port = 3000;
const server = createServer((req , res) => {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if(req.method === "GET" && req.url === "/"){
        res.statusCode = 200;
        res.setHeader("Content-Type" , "text/plain");
        res.end("Welcome to the Home Page!");
    }else if(req.method == "GET" && req.url == "/info"){
        res.statusCode = 200;
        res.setHeader("Content-Type" , 'text/plain');
        res.end("This is the information page");
    }else if(req.method === "POST"  && req.url === "/submit"){     
        res.statusCode = 200;
        res.setHeader("Content-Type" , 'application/json');
        res.end(JSON.stringify({
            message: "Recieved Sucessfully!",
            revievedAt : new Date().toISOString()
        }))
    }else{
        res.statusCode = 404;
        res.setHeader('Content-Type' , 'text/plain');
        res.end("Page Not found!");
    }
})


server.listen(port , () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

