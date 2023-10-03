const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
    if (new Date(req.body.publishDate) < Date.now()) {
      return res.status(422).json({
        error: {
          publishDate: "Publish date must not have been less than now !!!",
        },
      });
    }
  }
  setTimeout(() => {
    next();
  }, 500);
  // Continue to JSON Server router
});
// Use default router
server.use(router);
server.listen(3004, () => {
  console.log("JSON Server is running");
});
