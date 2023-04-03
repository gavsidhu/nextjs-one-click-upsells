import { useRouter } from "next/router";
import update from "immutability-helper";
import React, { useCallback, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableImage from "./DraggableImage";
import axios from "axios";
import { convertURLToFile } from "@/utils/helpers";
import { ProductImage } from "@/types/products";
import { Database } from "../../../../types_db";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

interface FormData {
  product_name: string;
  description: string;
  price: number;
  user_id: string;
  shop_id: number;
}

interface Image {
  id: number;
  url: string;
  name: string;
  alt: string;
}

interface Props {
  product: Database["public"]["Tables"]["products"]["Row"];
  imagesData: {
    image: Database["public"]["Tables"]["product_images"]["Row"];
    path: string;
  }[];
}

const supabase = createBrowserSupabaseClient<Database>();

const ProductDetails = ({ product, imagesData }: Props) => {
  const user = useUser();
  const router = useRouter();
  const { id, productId } = router.query;
  const [productData, setProductData] = useState<FormData>({
    product_name: product.product_name,
    description: product.description,
    price: product.price,
    user_id: user?.id as string,
    shop_id: parseInt(id as string),
  });

  const [images, setImages] = useState<Image[]>([]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const imagesArray: Image[] = [];

    for (let i = 0; i < files.length; i++) {
      imagesArray.push({
        id: i,
        url: URL.createObjectURL(files[i]),
        name: files[i].name,
        alt: "", // Initialize with an empty string
      });
    }

    setImages(imagesArray);
  };

  const moveImage = useCallback((dragIndex: number, hoverIndex: number) => {
    setImages((prevImages: Image[]) =>
      update(prevImages, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevImages[dragIndex] as Image],
        ],
      })
    );
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const updatedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageData = images;

    async function processImages(images: ProductImage[]) {
      const imageFiles = await Promise.all(
        images.map((image) => convertURLToFile(image))
      );
      return imageFiles;
    }
    const files = await processImages(images);
    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    files.forEach((file, index) => {
      formData.append("images", file); // Use 'images' field name for all files
    });

    formData.append("imageData", JSON.stringify(imageData));
    formData.append("productId",JSON.stringify(product.id))
    if (!productId) {
      throw new Error('Product ID is not provided');
    }

    const response = await axios.put(`/api/products/${parseInt(productId[0])}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.back()
  };

  const removeImage = async (imageId: number, imageUrls?:string[]) => {
    await supabase.storage.from("product-images").remove(imageUrls as string[])
    await supabase.from("product_images").delete().eq("id", imageId);
  };

  const handleAltChange = (imageId: number, newAltText: string) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === imageId ? { ...image, alt: newAltText } : image
      )
    );
  };

  const renderImage = useCallback((image: Image, index: number) => {
    return (
      <DraggableImage
        key={image.id}
        id={image.id}
        url={image.url}
        index={index}
        name={image.name}
        alt={image.alt}
        moveImage={moveImage}
        removeImage={() => removeImage(image.id)}
        handleAltChange={handleAltChange}
      />
    );
  }, []);

  return (
    <form
      className="space-y-8 divide-y divide-gray-200"
      onSubmit={(e) => updatedProduct(e)}
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              Edit product
            </h3>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Product Name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  value={productData.product_name}
                  name="product_name"
                  id="product_name"
                  className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Description
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  value={product.description}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="productImages"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Product images
              </label>
              {imagesData.length> 0 &&
                            <DndProvider backend={HTML5Backend}>
                            <div className="flex flex-col space-y-4">
                              {imagesData.map((image, index) => (
                                <DraggableImage
                                  key={image.image.id}
                                  id={image.image.id}
                                  url={image.path}
                                  index={index}
                                  alt={image.image.alt_text as string}
                                  moveImage={moveImage}
                                  removeImage={()=> removeImage(image.image.id,[image.image.image_url])}
                                  handleAltChange={handleAltChange}
                                />
                              ))}
                            </div>
                          </DndProvider>
              }
              {images.length > 0 ? (
                <DndProvider backend={HTML5Backend}>
                  <div className="flex flex-col space-y-4">
                    {images.map((image, index) => (
                      renderImage(image, index)
                    ))}
                  </div>
                </DndProvider>
              ) : (
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a image(s)</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            multiple
                            onChange={(e) => handleFiles(e)}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="price"
              className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
            >
              Price
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                value={product.price}
                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                aria-describedby="price-currency"
                onChange={(e) => onChange(e)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  USD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end gap-x-3">
          <button
            onClick={() => router.back()}
            type="button"
            className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductDetails;
