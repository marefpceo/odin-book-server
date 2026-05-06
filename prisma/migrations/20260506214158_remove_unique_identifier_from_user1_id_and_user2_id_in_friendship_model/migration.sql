-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'DECLINED';
ALTER TYPE "Status" ADD VALUE 'BLOCKED';

-- DropIndex
DROP INDEX "Friendship_user1Id_key";

-- DropIndex
DROP INDEX "Friendship_user2Id_key";
