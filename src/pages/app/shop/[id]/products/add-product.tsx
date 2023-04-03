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
        <div className='max-w-5xl mx-auto py-24'>
            <NewProductForm />
        </div>
    )
}

export default AddProduct