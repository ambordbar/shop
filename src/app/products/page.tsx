import ProductList from "../components/Card/ProductList";
import { getProducts } from "../action/getProducts";
import { getCategories } from "../action/getcategory";
import { getMinAndMaxPrice } from "../action/getMinAndMaxPrice";
import Filter from "../components/filter/filter";


export default async function ProductsPage() {
  const [products, categories, priceRange] = await Promise.all([
    getProducts(),
    getCategories(),
    getMinAndMaxPrice(),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Filter
        categories={categories}
        minPrice={priceRange.minPrice}
        maxPrice={priceRange.maxPrice}
      />
      <ProductList products={products} />
    </main>
  );
}
