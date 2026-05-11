// API returns "Placement", "Result", "Event" (capitalized)
// We lowercase them in server.js, so weights stay same
const TYPE_WEIGHTS = {
  placement: 100,
  result:    60,
  event:     20,
};

const RECENCY_FACTOR = 0.001;

function scoreNotification(notification) {
  const weight   = TYPE_WEIGHTS[notification.type] ?? 0;
  const epochSec = new Date(notification.timestamp).getTime() / 1000;
  const score    = weight + epochSec * RECENCY_FACTOR;
  return { ...notification, score };
}

module.exports = { scoreNotification, TYPE_WEIGHTS };