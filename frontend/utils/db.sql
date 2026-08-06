-- Create ENUM type for order status
CREATE TYPE orders_order_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'CANCELLED',
    'CLOSED'
);

-- Ensure uuid-ossp extension is enabled for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create 'books' table
CREATE TABLE books (
    "ID" SERIAL PRIMARY KEY,
    "TITLE" VARCHAR(150) NOT NULL,
    "DESCRIPTION" VARCHAR(255) NOT NULL,
    "PRICE" INT NOT NULL,
    "FILE_PATH" VARCHAR(200) NOT NULL,
    "SLUG" VARCHAR(150) NOT NULL,
    CONSTRAINT books_pk UNIQUE ("SLUG")
);

-- Create 'orders' table
CREATE TABLE orders (
    "ID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "EMAIL" VARCHAR(100) NOT NULL,
    "BOOK_ID" INT NOT NULL,
    "ORDER_STATUS" orders_order_status DEFAULT 'INACTIVE',
    "PAYMENT" BOOLEAN DEFAULT FALSE,
    "DATE_CREATED" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "DATE_LAST_UPDATED" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_to_orders FOREIGN KEY ("BOOK_ID") 
        REFERENCES books("ID") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION
);

-- Create index on foreign key
CREATE INDEX fk_books_to_orders ON orders("BOOK_ID");

-- Function and trigger to handle @updatedAt behavior
CREATE OR REPLACE FUNCTION update_date_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."DATE_LAST_UPDATED" = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_date_last_updated
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_date_last_updated_column();