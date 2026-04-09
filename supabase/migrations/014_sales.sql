-- Sales / Real Estate section
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_type TEXT NOT NULL DEFAULT 'house' CHECK (property_type IN ('house', 'apartment', 'land', 'commercial', 'other')),
  title_el TEXT NOT NULL DEFAULT '',
  title_en TEXT DEFAULT '',
  title_de TEXT DEFAULT '',
  title_bg TEXT DEFAULT '',
  title_ru TEXT DEFAULT '',
  title_ro TEXT DEFAULT '',
  description_el TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_de TEXT DEFAULT '',
  description_bg TEXT DEFAULT '',
  description_ru TEXT DEFAULT '',
  description_ro TEXT DEFAULT '',
  area TEXT DEFAULT 'kassandra',
  location_name TEXT DEFAULT '',
  latitude DOUBLE PRECISION DEFAULT 0,
  longitude DOUBLE PRECISION DEFAULT 0,
  price INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  size_sqm INTEGER DEFAULT 0,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  floor INTEGER DEFAULT 0,
  year_built INTEGER DEFAULT 0,
  energy_class TEXT DEFAULT '',
  features JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  meta_title_el TEXT DEFAULT '',
  meta_title_en TEXT DEFAULT '',
  meta_description_el TEXT DEFAULT '',
  meta_description_en TEXT DEFAULT '',
  image_alt TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sale_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sales_owner ON sales(owner_id);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_area ON sales(area);
CREATE INDEX idx_sales_type ON sales(property_type);
CREATE INDEX idx_sale_images_sale ON sale_images(sale_id);

-- RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_images ENABLE ROW LEVEL SECURITY;

-- Public can read published sales
CREATE POLICY "Public read published sales" ON sales FOR SELECT USING (status = 'published');
-- Owner can manage own sales
CREATE POLICY "Owner manage own sales" ON sales FOR ALL USING (auth.uid() = owner_id);
-- Superadmin full access
CREATE POLICY "Superadmin manage all sales" ON sales FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Sale images: public read, owner insert/delete
CREATE POLICY "Public read sale images" ON sale_images FOR SELECT USING (true);
CREATE POLICY "Owner manage sale images" ON sale_images FOR ALL
  USING (EXISTS (SELECT 1 FROM sales WHERE id = sale_images.sale_id AND owner_id = auth.uid()));
CREATE POLICY "Superadmin manage sale images" ON sale_images FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('sale-images', 'sale-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload sale images" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sale-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Public read sale images storage" ON storage.objects FOR SELECT
  USING (bucket_id = 'sale-images');
