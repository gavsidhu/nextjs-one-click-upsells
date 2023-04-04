import Layout from '@/components/site/Layout';
import NewProductForm from '@/components/site/products/NewProductForm'
import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'

const AddProduct = () => {
    const [images, setImages] = useState([
        {
            id: 1,
            name: 'Everyday Ruck Snack',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-04-featured-product-shot.jpg',
        },
    ]);
    return (
        <Layout title='Create a new product'>
            <NewProductForm />
        </Layout>
    )
}

export default AddProduct