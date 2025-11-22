-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'viewer', 'user');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('stable', 'deprecated');

-- CreateEnum
CREATE TYPE "ClusterStatus" AS ENUM ('running', 'pending');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "supportStatus" "SupportStatus" NOT NULL,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clusters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nodeCount" INTEGER NOT NULL,
    "status" "ClusterStatus" NOT NULL,
    "labels" JSONB,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,

    CONSTRAINT "clusters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "versions_version_key" ON "versions"("version");

-- CreateIndex
CREATE UNIQUE INDEX "regions_code_key" ON "regions"("code");

-- AddForeignKey
ALTER TABLE "clusters" ADD CONSTRAINT "clusters_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clusters" ADD CONSTRAINT "clusters_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clusters" ADD CONSTRAINT "clusters_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
