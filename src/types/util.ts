type SoftFixedArray<T, N extends number> = T[] & { length: N };
type SoftFixedArrayGrid<T, N extends number> = SoftFixedArray<T, N>[] & { length: N };

export type { SoftFixedArray, SoftFixedArrayGrid };