import Image from "next/image";
import { getProduct } from "@/app/action/getSingleProduct";
import { Product } from "@/types";
import ClientAddToCart from './ClientAddToCart';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product: Product = await getProduct(id);
  const { title, price, image, rating, description, category } = product;

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded-lg mt-5">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full h-96">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600 mb-2">Category: {category}</p>
          <div className="flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>
              {rating.rate} ({rating.count} Comments)
            </span>
          </div>
          <p className="text-xl text-gray-800 mb-4">${price.toFixed(2)}</p>
          <p className="text-gray-700 mb-8">{description}</p>
          <ClientAddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
