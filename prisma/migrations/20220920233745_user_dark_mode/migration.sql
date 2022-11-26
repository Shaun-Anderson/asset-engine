-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "current_period_end" DATETIME,
    "dark_mode" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("current_period_end", "email", "emailVerified", "id", "image", "isActive", "name", "stripeCustomerId") SELECT "current_period_end", "email", "emailVerified", "id", "image", "isActive", "name", "stripeCustomerId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
