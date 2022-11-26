/*
  Warnings:

  - You are about to alter the column `rate` on the `Worklog` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
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
    "modified_at" DATETIME NOT NULL
);
INSERT INTO "new_Worklog" ("client_id", "created_at", "description", "id", "modified_at", "rate", "recorded_at", "user_id", "value") SELECT "client_id", "created_at", "description", "id", "modified_at", "rate", "recorded_at", "user_id", "value" FROM "Worklog";
DROP TABLE "Worklog";
ALTER TABLE "new_Worklog" RENAME TO "Worklog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
