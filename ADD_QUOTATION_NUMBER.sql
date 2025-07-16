-- Add the missing quotation_number column to the quotations table
-- This column is required by the backend Sequelize model

ALTER TABLE quotations 
ADD COLUMN quotation_number VARCHAR(255) UNIQUE;

-- Add a NOT NULL constraint after adding the column
-- Note: You may need to populate existing records first before adding NOT NULL
-- For now, let's make it nullable and the backend will handle generation

-- Optional: If you want to populate existing records with generated quotation numbers
-- UPDATE quotations 
-- SET quotation_number = 'Q-' || EXTRACT(EPOCH FROM created_at)::text 
-- WHERE quotation_number IS NULL;

-- Then add the NOT NULL constraint
-- ALTER TABLE quotations 
-- ALTER COLUMN quotation_number SET NOT NULL;