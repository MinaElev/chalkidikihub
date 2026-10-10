type LogType = 'error' | 'user_action' | 'admin_action' | 'system';
type LogSeverity = 'info' | 'warning' | 'error';

export function logEvent(
  type: LogType,
  severity: LogSeverity,
  message: string,
  details?: Record<string, unknown>
) {
  // Fire-and-forget — never blocks UI
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, severity, message, details: details || {} }),
  }).catch(() => {});
}
