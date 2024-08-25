import { useState,useRef,useEffect, Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { createResource, fetchTrendingProducts } from "../../api/FetchData";
import { Link } from "react-router-dom";
import ErrorFallback from '../../api/ApiLink';
import Rectangle from "../Rectangle";
import { formatMoney } from "../../utils/Helper";

function TrendingSkeleton() {
    const elements = Array.from({ length: 14 });
    return (
        <div className="flex flex-wrap justify-start">
            {elements.map((_,index) => (
                <div key={index} className="m-1 block w-48 h-auto max-w-auto"> 
                    <div className="bg-white w-full h-52 flex flex-col trending-card">
                        <div className="bg-gray-200 h-3/5 w-3/5 m-auto"/>
                        <div className="p-2 flex flex-col justify-between">
                            <div className="bg-gray-200 rounded-md h-4 w-3/5 m-auto mb-3"/>
                            <div className="bg-gray-200 rounded-md h-4 w-2/5 m-auto mb-1"/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function TrendingProductList({ productResource, loadMoreProducts }) {
    const data = productResource.read();

    const products = data.products;
    const totalProducts = data.totalProducts;

    return (
        <>
            <div className="flex flex-wrap justify-start">
                {products.map(product => (
                    <Link key={product.id} to={`/product/${product.id}`} className="m-1 block w-48 h-auto max-w-auto">
                        <div className="bg-white w-full h-full flex flex-col trending-card">
                            {product.image ? (
                                <img src={`http://127.0.0.1:8000/${product.image}`} className='h-40 w-4/5 p-3 m-auto bg-cover' alt={product.name} />
                            ) : <Rectangle />}
                            <div className="p-2 flex flex-col justify-between">
                                <p className="text-center truncate">{product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}</p>
                                <p className='text-xl font-bold text-sky-700 my-4'>₱ {formatMoney(product.price)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {products.length < totalProducts.length && (
                <div className="flex justify-center items-center my-12">
                    <button className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md animate-bounce"
                        onClick={loadMoreProducts}>
                        More products
                    </button>
                </div>
            )}
        </>
    );
}

function Trending() {
    const [initialSlice, setInitialSlice] = useState(0);
    const [endSlice, setEndSlice] = useState(14);
    const [resourceTrigger, setResourceTrigger] = useState(0);  // This state will trigger a re-render

    // Ref to hold the resource
    const productResourceRef = useRef(createResource(fetchTrendingProducts(initialSlice, endSlice)));

    // Effect to update the resource only when endSlice changes
    useEffect(() => {
        productResourceRef.current = createResource(fetchTrendingProducts(initialSlice, endSlice));
        setResourceTrigger(prev => prev + 1);  // Trigger a re-render
    }, [endSlice]);

    const loadMoreProducts = () => {
        setEndSlice(prev => prev + 7);
    };

    return (
        <section className="h-1/2 flex flex-col items-center mb-32">
            <div className='container mx-auto px-8'>
                <p className="text-4xl uppercase font-bold tracking-widest text-center mt-32 mb-20">Products</p>
                <ErrorBoundary
                    FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<TrendingSkeleton/>}>
                        <TrendingProductList
                            productResource={productResourceRef.current}
                            loadMoreProducts={loadMoreProducts}
                        />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </section>
    );
}


export default Trending;
