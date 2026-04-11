-- DropForeignKey
ALTER TABLE "Comment_Like" DROP CONSTRAINT "Comment_Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Post_Like" DROP CONSTRAINT "Post_Like_postId_fkey";

-- AddForeignKey
ALTER TABLE "Post_Like" ADD CONSTRAINT "Post_Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment_Like" ADD CONSTRAINT "Comment_Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
