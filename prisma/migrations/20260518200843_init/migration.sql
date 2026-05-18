-- CreateTable
CREATE TABLE "public"."CompatibilityEntry" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name1" TEXT NOT NULL,
    "name2" TEXT NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "CompatibilityEntry_pkey" PRIMARY KEY ("id")
);
