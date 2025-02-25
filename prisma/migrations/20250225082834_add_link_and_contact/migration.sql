-- CreateTable
CREATE TABLE "applications" (
    "applicationId" TEXT NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "applicationLink" VARCHAR(255) NOT NULL,
    "contactEmail" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "jobDescription" VARCHAR(255) NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationMethod" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "nextStep" VARCHAR(255),
    "followUpDate" TIMESTAMP(3),
    "notes" VARCHAR(255),

    CONSTRAINT "applications_pkey" PRIMARY KEY ("applicationId")
);
