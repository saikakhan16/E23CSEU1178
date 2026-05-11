const express = require("express");
const cors    = require("cors");
const { requestLogger } = require("../logging_middleware");
const TopNHeap          = require("./priorityHeap");
const { scoreNotification } = require("./scorer");

const app  = express();
const PORT = process.env.PORT || 5000;

const REAL_API = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTE3OEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NjQyNCwiaWF0IjoxNzc4NDg1NTI0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmE3ZTA3ZjItYjZkYS00ZjJlLWI4YzMtZDM0YmZkZmI2M2U5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Fpa2Ega2hhbiIsInN1YiI6Ijg1ZGZjYTgwLTQzYWEtNDc3NS04NDY5LTMzOThmNWU2ZWM4NiJ9LCJlbWFpbCI6ImUyM2NzZXUxMTc4QGJlbm5ldHQuZWR1LmluIiwibmFtZSI6InNhaWthIGtoYW4iLCJyb2xsTm8iOiJlMjNjc2V1MTE3OCIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6Ijg1ZGZjYTgwLTQzYWEtNDc3NS04NDY5LTMzOThmNWU2ZWM4NiIsImNsaWVudFNlY3JldCI6IlF3eHNHclNIa3ZjUlpCcHIifQ.FuKI4yktIWxGWfS_zE_SRXRo4yKYVcCOHeEd_g3B0zo";

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ── Fetch live from real API ───────────────────────────────────────────────
async function fetchNotifications() {
  const res  = await fetch(REAL_API, {
    headers: { "Authorization": `Bearer ${TOKEN}` }
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`API returned non-JSON (status ${res.status})`);
  }
  if (!json.notifications) throw new Error(json.message || "No notifications.");

  // Normalize: ID/Type/Message/Timestamp → id/type/title/timestamp
  return json.notifications.map((n) => ({
    id:        n.ID,
    type:      n.Type.toLowerCase(),
    title:     n.Message,
    body:      n.Message,
    timestamp: n.Timestamp,
  }));
}

// GET all notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const data = await fetchNotifications();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET top-N priority sorted
app.get("/api/notifications/priority", async (req, res) => {
  try {
    const topN = Math.min(parseInt(req.query.topN) || 10, 50);
    const data = await fetchNotifications();

    const heap = new TopNHeap(topN);
    data.forEach((n) => heap.insert(scoreNotification(n)));

    res.json({ success: true, topN, count: heap.size, data: heap.getTopN() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use((req, res) => res.status(404).json({ success: false, error: "Route not found." }));

app.listen(PORT, () => {
  console.log(`\n Backend running at http://localhost:${PORT}`);
  console.log(`   GET  /api/notifications`);
  console.log(`   GET  /api/notifications/priority?topN=10\n`);
});