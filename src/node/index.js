require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// const port = 社員番号;
const port = 2924;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "db",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客削除エンドポイント（DELETEメソッド）
app.get("/customer/:customerId", async (req, res) => {
	const { customerId } = req.params;
	try {
	  const result = await pool.query(
		"SELECT * FROM customers WHERE customer_id = $1",
		[customerId]
	  );
	  if (result.rows.length === 0) {
		return res.status(404).json({ error: "Customer not found" });
	  }
	  res.json(result.rows[0]);
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "Internal server error" });
	}
  });


  app.delete("/delete-customer/:customerId", async (req, res) => {
	const { customerId } = req.params;
	try {
	  const result = await pool.query(
		"DELETE FROM customers WHERE customer_id = $1",
		[customerId]
	  );
	  if (result.rowCount === 0) {
		return res.status(404).json({ error: "Customer not found" });
	  }
	  res.json({ success: true });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "Internal server error" });
	}
  });
  
  

  app.put("/update-customer/:customerId", async (req, res) => {
	const { customerId } = req.params;
	const { companyName, industry, contact, location } = req.body;
  
	try {
	  const result = await pool.query(
		`UPDATE customers SET company_name=$1, industry=$2, contact=$3, location=$4, updated_date=NOW() WHERE customer_id=$5`,
		[companyName, industry, contact, location, customerId]
	  );
  
	  if (result.rowCount === 0) {
		return res.status(404).json({ error: "顧客が見つかりませんでした" });
	  }
	  res.json({ success: true });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ error: "サーバーエラー" });
	}
  });
  
  
const path = require("path");
app.use(express.static("public"));
app.use('/web', express.static(path.join(__dirname, "../web")));
