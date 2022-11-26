-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_id" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    "paid_date" DATETIME,
    "status" TEXT NOT NULL,
    "totalCost" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    "consume_worklogs" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("client_id", "consume_worklogs", "created_at", "due_date", "id", "modified_at", "paid_date", "status", "totalCost") SELECT "client_id", "consume_worklogs", "created_at", "due_date", "id", "modified_at", "paid_date", "status", "totalCost" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
