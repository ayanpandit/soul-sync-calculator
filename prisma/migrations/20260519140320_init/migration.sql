-- CreateTable
CREATE TABLE "SoulSyncResult" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "yourName" TEXT NOT NULL,
    "theirName" TEXT NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "SoulSyncResult_pkey" PRIMARY KEY ("id")
);
