import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, title, price, image, rating, category } = product;

  const isNew = rating.rate >= 4.5;

  return (
    <Link
      href={`/products/${id}`}
      className="group relative block overflow-hidden"
    >
      <button
        className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
        aria-label="Add to wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>

      <div className="relative h-64 w-full sm:h-72">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {isNew && (
          <span className="absolute top-4 left-4 z-10 bg-yellow-400 px-3 py-1.5 text-xs font-medium whitespace-nowrap">
            New
          </span>
        )}
      </div>

      <div className="relative border border-gray-100 bg-white p-6">
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 line-clamp-3 md:line-clamp-1">
              {title}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{category}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className=" text-sm text-gray-700">${price.toFixed(2)}</p>
          <div className="flex items-center gap-1 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-xs">
              {rating.rate} ({rating.count})
            </p>
          </div>
        </div>

        <form className="mt-4">
          <button
            type="submit"
            className="block w-full rounded-sm bg-yellow-400 p-4 text-sm font-medium hover:bg-yellow-500"
          >
            Add to Cart
          </button>
        </form>
      </div>
    </Link>
  );
}
