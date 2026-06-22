-- =============================================================================
-- TEMPORARY test data for visually verifying the Project Details page.
-- Run this in the SQL Editor, view the page, then run the cleanup query at
-- the bottom of this file to remove it. NOT part of the permanent schema.
-- =============================================================================

insert into public.projects (title, slug, description, category, location, completion_date, cover_image_url, status, is_featured, display_order)
values (
  'Jubilee Hills Residence',
  'jubilee-hills-residence',
  'A warm, contemporary home that balances open-plan living with quiet, intimate corners. Natural materials, soft brass accents, and a restrained palette let the family''s art collection take center stage throughout the 4,200 sq ft residence.',
  'residential_interiors',
  'Jubilee Hills, Hyderabad',
  '2025-11-15',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80',
  'published',
  true,
  1
)
returning id;
