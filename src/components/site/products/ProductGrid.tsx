import { Database } from "../../../../types_db"
import ProductCard from "./ProductCard"

interface Props {
  products: Database["public"]["Tables"]["products"]["Row"][]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products && products.map((product) => (
        <ProductCard product={product} />
      ))}
    </div>
  )
}