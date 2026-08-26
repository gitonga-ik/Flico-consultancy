/*
  Warnings:

  - Made the column `CUST_DOC` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "CUST_DOC" SET NOT NULL;
