import { z } from "zod";

export interface Order {
  /**
   * A UUID for the order.
   */
  id: string;
  /**
   * The name of the product purchased.
   */
  productName: string;
  /**
   * The amount of the order.
   */
  amount: number;
  /**
   * The percentage of the discount applied to the order.
   * This is between 0 and 100.
   * Not defined if no discount was applied.
   */
  discount?: number;
  /**
   * The address the order was shipped to.
   */
  address: {
    /**
     * The address street.
     * @example "123 Main St"
     */
    street: string;
    /**
     * The city the order was shipped to.
     * @example "San Francisco"
     */
    city: string;
    /**
     * The state the order was shipped to.
     * @example "California"
     */
    state: string;
    /**
     * The zip code the order was shipped to.
     * @example "94105"
     */
    zip: string;
  };
  /**
   * The current status of the order.
   */
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  /**
   * The date the order was placed.
   */
  orderedAt: Date;
}

export const filterSchema = (productNames: string[]) => {
  const productNamesAsString = productNames
    .map((p) => p.toLowerCase())
    .join(", ");
  return z
    .object({
      productNames: z
        .array(
          z.enum([
            productNames[0],
            ...productNames.slice(1, productNames.length),
          ]),
        )
        .optional()
        .describe(
          `Filter orders by the product name. Lowercase only. MUST only be a list of the following products: ${productNamesAsString}`,
        ),
      beforeDate: z
        .string()
        .transform((str) => new Date(str))
        .optional()
        .describe(
          "Filter orders placed before this date. Must be a valid date in the format 'YYYY-MM-DD'",
        ),
      afterDate: z
        .string()
        .transform((str) => new Date(str))
        .optional()
        .describe(
          "Filter orders placed after this date. Must be a valid date in the format 'YYYY-MM-DD'",
        ),
      minAmount: z
        .number()
        .optional()
        .describe("The minimum amount of the order to filter by."),
      maxAmount: z
        .number()
        .optional()
        .describe("The maximum amount of the order to filter by."),
      state: z
        .string()
        .optional()
        .describe(
          "Filter orders by the state the order was placed in. Example: 'California'",
        ),
      discount: z
        .boolean()
        .optional()
        .describe("Filter orders by whether or not it had a discount applied."),
      minDiscountPercentage: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .describe(
          "Filter orders which had at least this amount discounted (in percentage)",
        ),
      status: z
        .enum([
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned",
        ])
        .optional()
        .describe("The current status of the order."),
    })
    .describe("Available filters to apply to orders.");
};

export interface Filter {
  productNames?: string[];
  beforeDate?: Date;
  afterDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  state?: string;
  city?: string;
  discount?: boolean;
  minDiscountPercentage?: number;
  status?:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
}
