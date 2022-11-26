-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Worklog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT,
    "value" INTEGER NOT NULL,
    "rate" REAL,
    "description" TEXT NOT NULL,
    "recorded_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    "invoice_id" TEXT,
    CONSTRAINT "Worklog_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Worklog_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Worklog" ("client_id", "created_at", "description", "id", "modified_at", "rate", "recorded_at", "user_id", "value") SELECT "client_id", "created_at", "description", "id", "modified_at", "rate", "recorded_at", "user_id", "value" FROM "Worklog";
DROP TABLE "Worklog";
ALTER TABLE "new_Worklog" RENAME TO "Worklog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
