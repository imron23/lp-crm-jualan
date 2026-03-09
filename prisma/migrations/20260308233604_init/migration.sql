-- CreateTable
CREATE TABLE "Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "adsBudget" TEXT,
    "pilgrimsCount" INTEGER,
    "obstacles" TEXT,
    "expectedFeatures" TEXT,
    "meetingTime" TEXT,
    "agreed" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
