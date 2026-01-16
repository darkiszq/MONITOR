import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = 8080;

const dbPool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "uptime",
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

app.use(express.json());

app.post("/", (req, res) => {
  res.json({ ok: true, message: "POST Request IS Called", body: req.body });
});

app.post("/datainsert", async (req, res) => {
  console.log("/datainsert hit from", req.ip, "body:", req.body);
  let { isup, domain } = req.body;

  domain = await idGet(res, domain);

  console.log(domain);

  if (typeof isup === "undefined" || typeof domain === "undefined") {
    return res
      .status(400)
      .json({ ok: false, error: "Missing isup or domain in request body" });
  }

  isup = isup ? 1 : 0;
  domain = Number(domain);
  if (Number.isNaN(domain)) {
    return res
      .status(400)
      .json({ ok: false, error: "domain must be a number" });
  }

  if (domain == -1) {
    return res
      .status(400)
      .json({ ok: false, error: "Domain does not exist in database" });
  }

  try {
    const [result] = await dbPool.execute(
      "INSERT INTO register (time, is_up, domain_id) VALUES (CURRENT_TIMESTAMP(6), ?, ?)",
      [isup, domain]
    );
    console.log("DB insert result:", result);
    res.json({ ok: true, result });
  } catch (err) {
    console.error("DB insert error:", err.error);
    res.status(400).json({ ok: false, error: String(err) });
  }
});

//SELECT ((SELECT count(*) FROM register where is_up = 1 and domain_id = 4) / ((SELECT count(*) FROM register where is_up = 0 and domain_id = 4) + (SELECT count(*) FROM register where is_up = 1 and domain_id = 4))) FROM `register` WHERE 1 limit 1;
//SELECT id FROM `domain` where name = "https://ebicom.pl";

app.post("/graphfromdomain", async (req, res) => {
  let { domain } = req.body;
  let id = -1;
  id = await idGet(res, domain);
  if (id != -1) {
    try {
      const [result] = await dbPool.execute(
        "SELECT ((SELECT count(*) FROM register where is_up = 1 and domain_id = ?) / ((SELECT count(*) FROM register where is_up = 0 and domain_id = ?) + (SELECT count(*) FROM register where is_up = 1 and domain_id = ?))) as percent FROM `register` WHERE 1 limit 1; ",
        [id, id, id]
      );
      console.log(result);
      res.json({ ok: true, result: result[0].percent });
    } catch (err) {
      console.error("DB error:", err);
      res.status(400).json({ ok: false, error: String(err) });
    }
  }
});

app.post("/raportfromdomain", async (req, res) => {
  let { domain } = req.body;
  let id = -1;
  id = await idGet(res, domain);
  if (id != -1) {
    try {
      const [result] = await dbPool.execute(
        "SELECT round(register.time,0) as 'Date', register.is_up as 'Turned on', domain.name as 'Domain' FROM register join domain on domain.id = register.domain_id where register.domain_id = ? ORDER BY time DESC",
        [id]
      );
      console.log(result);
      res.json({ Title: `RAPORT FROM ${domain}`, result: result });
    } catch (err) {
      console.error("DB error:", err);
      res.status(400).json({ ok: false, error: String(err) });
    }
  }
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

async function idGet(res, domain) {
  try {
    let id = -1;
    const [result] = await dbPool.execute(
      "SELECT id FROM `domain` where name = ?",
      [domain]
    );
    console.log(result);
    id = result[0].id;
    return id;
  } catch (err) {
    console.error("DB error:", err.error);
    res.status(400).json({ ok: false, error: String(err) });
    return -1;
  }
}
