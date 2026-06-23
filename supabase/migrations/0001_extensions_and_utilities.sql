-- =============================================================================
-- Ivory Edge Interiors — Migration 0001
-- Extensions & shared utilities
-- =============================================================================

-- UUID generation
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Shared trigger function: keeps `updated_at` current on every UPDATE.
-- Attached to every table below that has an `updated_at` column.
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Generic trigger function: sets updated_at = now() on row update.';
