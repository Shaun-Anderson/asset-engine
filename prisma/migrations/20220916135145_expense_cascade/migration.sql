-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    CONSTRAINT "Expense_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("cost", "created_at", "description", "id", "invoice_id", "modified_at", "quantity") SELECT "cost", "created_at", "description", "id", "invoice_id", "modified_at", "quantity" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
