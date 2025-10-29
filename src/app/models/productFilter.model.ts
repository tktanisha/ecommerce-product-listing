export interface ProductFilters {
  title?: string;
  limit?: number;
  skip?: number;
  sortBy?: 'price' | null;
  order?: 'asc' | 'desc' | null;
}
