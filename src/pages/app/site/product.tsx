import Layout from "@/components/app/Layout";
import ProductGrid from "@/components/site/ProductGrid";
import { siteNavigation } from "@/constants/navigation";
import React from "react";

const product = () => {
  return (
    <Layout title="Products" navigation={siteNavigation}>
      <div className="bg-white px-16 py-12 rounded-md shadow-lg">
      <ProductGrid />
      </div>
    </Layout>
  );
};

export default product;
