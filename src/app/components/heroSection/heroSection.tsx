import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white rounded-lg">
      <div className="container mx-auto px-4 my-4 py-4 sm:py-8 lg:py-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        {/* Text content */}
        <div className="max-w-prose text-left">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            This is a Shop smart and
            <strong className="text-yellow-600"> increase </strong>
            <br />
            your savings.
          </h1>

          <p className="mt-4 text-base text-gray-700 sm:text-lg sm:leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
            nisi. Natus, provident accusamus impedit minima harum corporis
            iusto.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Link
              href="/products"
              className="inline-block rounded-md border border-yellow-600 bg-yellow-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm transition-colors hover:bg-yellow-700"
            >
              Enter the store
            </Link>

            <Link
              href="#"
              className="inline-block rounded-md border border-gray-200 px-6 py-3 text-center text-base font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <Image
            src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Illustration of user flow and conversions"
            width={600}
            height={400}
            className="w-full h-auto hidden lg:block rounded-2xl"
            priority
            layout="responsive"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
