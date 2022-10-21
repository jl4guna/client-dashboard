-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "status" INTEGER NOT NULL,
    "analystId" TEXT NOT NULL,
    "creditCardId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "Analyst" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Client_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "CreditCard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("analystId", "birthDate", "createdAt", "creditCardId", "email", "id", "lastName", "middleName", "name", "phone", "secondLastName", "status", "updatedAt") SELECT "analystId", "birthDate", "createdAt", "creditCardId", "email", "id", "lastName", "middleName", "name", "phone", "secondLastName", "status", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE UNIQUE INDEX "Client_creditCardId_key" ON "Client"("creditCardId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
