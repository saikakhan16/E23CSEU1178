import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://4.224.186.213/evaluation-service/notifications";
const TOKEN    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTE3OEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4NjQyNCwiaWF0IjoxNzc4NDg1NTI0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmE3ZTA3ZjItYjZkYS00ZjJlLWI4YzMtZDM0YmZkZmI2M2U5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2Fpa2Ega2hhbiIsInN1YiI6Ijg1ZGZjYTgwLTQzYWEtNDc3NS04NDY5LTMzOThmNWU2ZWM4NiJ9LCJlbWFpbCI6ImUyM2NzZXUxMTc4QGJlbm5ldHQuZWR1LmluIiwibmFtZSI6InNhaWthIGtoYW4iLCJyb2xsTm8iOiJlMjNjc2V1MTE3OCIsImFjY2Vzc0NvZGUiOiJUZkR4Z3IiLCJjbGllbnRJRCI6Ijg1ZGZjYTgwLTQzYWEtNDc3NS04NDY5LTMzOThmNWU2ZWM4NiIsImNsaWVudFNlY3JldCI6IlF3eHNHclNIa3ZjUlpCcHIifQ.FuKI4yktIWxGWfS_zE_SRXRo4yKYVcCOHeEd_g3B0zo";

const TYPE_WEIGHTS   = { placement: 100, result: 60, event: 20 };
const RECENCY_FACTOR = 0.001;

function scoreNotification(n) {
  const weight   = TYPE_WEIGHTS[n.Type?.toLowerCase()] ?? 0;
  const epochSec = new Date(n.Timestamp).getTime() / 1000;
  return { ...n, score: weight + epochSec * RECENCY_FACTOR };
}

export function useNotifications({ type = "", limit = 100 } = {}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE}?limit=${limit}`;
      if (type) url += `&notification_type=${type}`;
      const res  = await fetch(url, { headers: { "Authorization": `Bearer ${TOKEN}` } });
      const json = await res.json();
      if (!json.notifications) throw new Error(json.message || "Failed to fetch");
      setNotifications(json.notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, limit]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { notifications, loading, error, refetch: fetchData };
}

export function usePriorityNotifications({ type = "", topN = 10 } = {}) {
  const { notifications, loading, error, refetch } = useNotifications({ limit: 100, type });

  const prioritized = [...notifications]
    .map(scoreNotification)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return { notifications: prioritized, loading, error, refetch };
}