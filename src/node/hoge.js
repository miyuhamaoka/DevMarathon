const express = require("express");
const app = express();
// const port = 3000;
const port = 1985;


// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });
app.get("/", (req, res) => {
	res.send(`
	  <html>
		<head>
		  <title>Hello</title>
		</head>
		<body>
		  <h1 style="color: red;">Hello, World!</h1>
		</body>
	  </html>
	`);
  });


app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
