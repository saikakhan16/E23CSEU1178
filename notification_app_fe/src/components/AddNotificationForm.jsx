import React, { useState } from "react";

export default function AddNotificationForm({ onAdd }) {
  const [form, setForm]     = useState({ type: "placement", title: "", body: "" });
  const [status, setStatus] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setStatus("loading");
    try {
      await onAdd(form);
      setStatus("success");
      setForm({ type: "placement", title: "", body: "" });
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const inp = { padding:"9px 12px", borderRadius:8, border:"1px solid #d1d5db",
                fontSize:13, fontFamily:"inherit", width:"100%", boxSizing:"border-box" };

  return (
    <form onSubmit={handleSubmit} style={{ background:"#fff", border:"1px solid #e5e7eb",
          borderRadius:14, padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
      <h2 style={{ margin:0, fontSize:15, fontWeight:700 }}>Send New Notification</h2>

      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>Type</label>
        <select name="type" value={form.type} onChange={handleChange} style={inp}>
          <option value="placement">🏢 Placement</option>
          <option value="result">📊 Result</option>
          <option value="event">🎉 Event</option>
        </select>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>Title</label>
        <input name="title" value={form.title} onChange={handleChange}
               placeholder="e.g. Wipro Drive Announced" style={inp} required />
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"#6b7280" }}>Body</label>
        <textarea name="body" value={form.body} onChange={handleChange}
                  placeholder="Notification details..." style={{ ...inp, height:72, resize:"vertical" }} required />
      </div>

      <button type="submit" disabled={status === "loading"}
              style={{ background:"#4f46e5", color:"#fff", border:"none", borderRadius:8,
                       padding:"10px 0", fontSize:13, fontWeight:600, cursor:"pointer" }}>
        {status === "loading" ? "Sending..." : "Add Notification"}
      </button>

      {status === "success" && <p style={{ margin:0, fontSize:12, color:"#1e7d4b" }}>✅ Added! Heap updated.</p>}
      {status === "error"   && <p style={{ margin:0, fontSize:12, color:"#dc2626" }}>❌ {errMsg}</p>}
    </form>
  );
}