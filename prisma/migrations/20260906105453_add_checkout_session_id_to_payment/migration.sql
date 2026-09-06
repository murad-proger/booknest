-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "checkoutSessionId" TEXT;

-- CreateIndex
CREATE INDEX "Payment_checkoutSessionId_idx" ON "Payment"("checkoutSessionId");
