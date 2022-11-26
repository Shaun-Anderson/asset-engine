-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoice_id" TEXT NOT NULL,
    "cost" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    CONSTRAINT "Expense_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
