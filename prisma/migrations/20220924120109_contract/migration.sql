-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "rate" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" DATETIME NOT NULL,
    CONSTRAINT "Contract_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
