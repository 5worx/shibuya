export interface Category {
  name: "Haushalt" | "Technik";
}

/**
 * Nothing special. Just an example class as a showcase.
 *
 * @example
 * const coffee = new Example('Kaffeemaschine', 99.99, {
 *   name: 'Haushalt',
 * });
 *
 * @class
 * @member Example
 */
export class Example {
  /** Name of the Product */
  name: string;
  /** Price without tax */
  price: number;
  /** Product category */
  category: string;
  /** @protected Normal tax value. default: 19% */
  protected _tax: number = 1.19;
  /** @protected Price with tax */
  protected _total: number;

  constructor(name: string, price: number, category: Category) {
    this.name = name;
    this.price = price;
    this._total = this.price * this._tax;
    this.category = category.name as string;
  }

  /**
   * Returns the price with tax value.
   *
   * @returns rounded value _total with two digits
   */
  get total(): number {
    return +(Math.round(Number(this._total + "e+2")) + "e-2");
  }
}
