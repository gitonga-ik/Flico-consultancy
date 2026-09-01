-- CreateEnum
CREATE TYPE "MpesaTransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "mpesa_transactions" (
    "ID" TEXT NOT NULL,
    "ORDER_ID" TEXT NOT NULL,
    "CONTACT" TEXT NOT NULL,
    "AMOUNT" DECIMAL(10,2) NOT NULL,
    "TRANSACTION_DESCRIPTION" TEXT,
    "MERCHANT_REQUEST_ID" TEXT,
    "CHECKOUT_REQUEST_ID" TEXT,
    "MPESA_RECEIPT_NUMBER" TEXT,
    "STATUS" "MpesaTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "RESULT_CODE" INTEGER,
    "RESULT_DESCRIPTION" TEXT,
    "REQUEST_TIMESTAMP" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TRANSACTION_DATE" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mpesa_transactions_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "mpesa_transactions_CHECKOUT_REQUEST_ID_key" ON "mpesa_transactions"("CHECKOUT_REQUEST_ID");

-- CreateIndex
CREATE UNIQUE INDEX "mpesa_transactions_MPESA_RECEIPT_NUMBER_key" ON "mpesa_transactions"("MPESA_RECEIPT_NUMBER");

-- CreateIndex
CREATE INDEX "mpesa_transactions_ORDER_ID_idx" ON "mpesa_transactions"("ORDER_ID");

-- CreateIndex
CREATE INDEX "mpesa_transactions_CONTACT_idx" ON "mpesa_transactions"("CONTACT");

-- CreateIndex
CREATE INDEX "mpesa_transactions_STATUS_idx" ON "mpesa_transactions"("STATUS");
