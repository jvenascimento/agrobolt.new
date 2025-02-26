/*
  # Create farms management schema

  1. New Tables
    - `farms`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `area` (numeric)
      - `location` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `farms` table
    - Add policies for authenticated users to:
      - Read their own farms
      - Create new farms
      - Update their own farms
      - Delete their own farms
*/

CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  area numeric NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE farms ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own farms
CREATE POLICY "Users can read own farms" 
  ON farms 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own farms
CREATE POLICY "Users can create farms" 
  ON farms 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own farms
CREATE POLICY "Users can update own farms" 
  ON farms 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own farms
CREATE POLICY "Users can delete own farms" 
  ON farms 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);