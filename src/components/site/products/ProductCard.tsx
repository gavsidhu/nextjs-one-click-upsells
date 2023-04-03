import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Database } from "../../../../types_db";

interface Props {
  product: Database["public"]["Tables"]["products"]["Row"];
}

const ProductCard = ({ product }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Link
      key={product.id}
      href={`/app/shop/${id}/products/${product.id}`}
      className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
    >
      <div className="flex-shrink-0">
        {/* {product.image && <img className="h-10 w-10 rounded-full" src={product.image} alt="" />} */}
      </div>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-900">
            {product.product_name}
          </p>
          <p className="truncate text-sm text-gray-500">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
