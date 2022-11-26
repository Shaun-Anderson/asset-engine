/*
  Warnings:

  - Added the required column `client_id` to the `Worklog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Worklog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recorded_at` to the `Worklog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Worklog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "recorded_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    CONSTRAINT "Worklog_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Worklog" ("created_at", "id", "modified_at", "user_id", "value") SELECT "created_at", "id", "modified_at", "user_id", "value" FROM "Worklog";
DROP TABLE "Worklog";
ALTER TABLE "new_Worklog" RENAME TO "Worklog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
