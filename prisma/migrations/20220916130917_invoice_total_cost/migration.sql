/*
  Warnings:

  - Added the required column `totalCost` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client_id" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "totalCost" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    CONSTRAINT "Invoice_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Invoice" ("client_id", "created_at", "due_date", "id", "modified_at", "status") SELECT "client_id", "created_at", "due_date", "id", "modified_at", "status" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
