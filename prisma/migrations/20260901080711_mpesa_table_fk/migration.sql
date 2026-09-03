/*
  Warnings:

  - The primary key for the `mpesa_transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `ID` column on the `mpesa_transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `ORDER_ID` on the `mpesa_transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "mpesa_transactions" DROP CONSTRAINT "mpesa_transactions_pkey",
DROP COLUMN "ID",
ADD COLUMN     "ID" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "ORDER_ID",
ADD COLUMN     "ORDER_ID" UUID NOT NULL,
ADD CONSTRAINT "mpesa_transactions_pkey" PRIMARY KEY ("ID");

-- CreateIndex
CREATE INDEX "mpesa_transactions_ORDER_ID_idx" ON "mpesa_transactions"("ORDER_ID");

-- AddForeignKey
ALTER TABLE "mpesa_transactions" ADD CONSTRAINT "fk_transaction_to_order" FOREIGN KEY ("ORDER_ID") REFERENCES "orders"("ID") ON DELETE NO ACTION ON UPDATE NO ACTION;
