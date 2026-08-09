import { Pool } from "pg";

const BASELINE = "20260809000000_baseline";

async function assertMigrationReady() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");

  const pool = new Pool({ connectionString });
  try {
    const { rows } = await pool.query<{
      has_schema: boolean;
      has_migration_history: boolean;
    }>(`
      SELECT
        to_regclass('public.users') IS NOT NULL AS has_schema,
        to_regclass('public._prisma_migrations') IS NOT NULL AS has_migration_history
    `);

    let baselineApplied = false;
    if (rows[0]?.has_migration_history) {
      const migration = await pool.query(
        `SELECT 1 FROM "_prisma_migrations" WHERE migration_name = $1 AND finished_at IS NOT NULL LIMIT 1`,
        [BASELINE],
      );
      baselineApplied = migration.rowCount === 1;
    }

    if (rows[0]?.has_schema && !baselineApplied) {
      throw new Error(
        `Existing schema has not adopted ${BASELINE}. Back it up, run scripts/adopt-legacy-database.sql, then run bunx prisma migrate resolve --applied ${BASELINE}.`,
      );
    }
  } finally {
    await pool.end();
  }
}

await assertMigrationReady();

const migrationProcess = Bun.spawn(["bunx", "prisma", "migrate", "deploy"], {
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

globalThis.process.exit(await migrationProcess.exited);
