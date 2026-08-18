/** Utilidades de formato de la interfaz. */

/**
 * Formatea un timestamp (ms) como hora local `HH:MM`.
 */
export function formatClock(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
