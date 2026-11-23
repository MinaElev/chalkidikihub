/**
 * Restaurant coordinates checked against each venue's Google Maps listing
 * (audit 2026-11-23, audit/sources/RESTAURANT-COORDS-AUDIT.md). Pages state
 * distances only for venues whose position is not in doubt.
 *
 * The six wrong positions were corrected in the database on 2026-11-23
 * (backup audit/coords-backup-*.json); none is in doubt now.
 */
export const COORDS_IN_DOUBT = new Set<string>([]);
