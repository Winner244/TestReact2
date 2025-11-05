import { z } from 'zod'

export const FiltersSchema = z
  .object({
    q: z.string().optional(),
    // categories as comma-separated string for simplicity (UI will accept comma list)
    categories: z.string().optional(),
    minPrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().nonnegative().optional()),
    maxPrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().nonnegative().optional()),
    rating: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0).max(5).optional()),
    discountedOnly: z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : undefined), z.boolean().optional()),
    minDiscountPercent: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0).optional()),
  })
  .refine(
    (data) =>
      data.maxPrice === undefined || data.minPrice === undefined || data.maxPrice >= data.minPrice,
    { message: 'maxPrice must be >= minPrice', path: ['maxPrice'] },
  )

export type Filters = z.infer<typeof FiltersSchema>