import ProductList from "../components/Card/ProductList";
import { getProducts } from "../action/getProducts";
import Filter from "../components/filter/filter";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      <Filter />
      <ProductList products={products} />
    </main>
  );
}
