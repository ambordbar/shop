import HeroSection from "./components/heroSection/heroSection";
import ProductList from "./components/Card/ProductList";
import { getProducts } from "./action/getProducts";
export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <HeroSection />
      <ProductList products={products} itemsPerPage={4} paggingView={false} />
    </main>
  );
}
