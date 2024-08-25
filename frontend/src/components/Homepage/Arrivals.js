/* global $ */
import React, { useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { createResource,fetchNewArrivalProducts } from '../../api/FetchData';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../api/ApiLink';
import { formatMoney } from '../../utils/Helper';
import Rectangle from '../Rectangle';

function NewArrivalSkeleton() {
    useEffect(() => {
        const initializeCarousel = () => {
            $("#owl-carousel-skeleton").owlCarousel('destroy'); 
            $("#owl-carousel-skeleton").owlCarousel({
                items: 4,
                autoplay: true,
                autoplayTimeout: 3000,
                loop: true,
                nav: true,
                dots: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                    },
                    600: {
                        items: 2,
                    },
                    1000: {
                        items: 4,
                    },
                },
            });
        };

        initializeCarousel();
    }, []);

    return (
        <>
            <div className="owl-carousel" id="owl-carousel-skeleton">
                <div className="item mx-8">
                    <div className="mx-auto bg-white border-solid border-2 border-gray rounded-lg w-60 h-60 flex flex-col justify-center items-center p-6 m-2">
                        <div className="bg-gray-200 h-full w-full m-auto mb-3"/>
                        <div className="bg-gray-200 rounded-md h-8 w-3/5 m-auto mb-3"/>
                        <div className="bg-gray-200 rounded-md h-8 w-2/5 m-auto mb-3"/>
                    </div>
                </div>
            </div>
        </>
    );
}

function NewArrivalList({productResource}) {
    const data = productResource.read();
    const products = data;

    useEffect(() => {
        const initializeCarousel = () => {
            $("#owl-carousel-2").owlCarousel('destroy'); 
            $("#owl-carousel-2").owlCarousel({
                items: 4,
                autoplay: true,
                autoplayTimeout: 3000,
                loop: true,
                nav: true,
                dots: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                    },
                    600: {
                        items: 2,
                    },
                    1000: {
                        items: 4,
                    },
                },
            });
        };

        initializeCarousel();
    }, []);

    return (
        <>
            <div className="owl-carousel" id="owl-carousel-2">
                {products.length > 0 && (
                    products.map(product => (
                        <div key={product.id} className="item mx-8">
                            <Link to={`/product/${product.id}`} className="mx-auto bg-white border-solid border-2 border-gray rounded-lg w-full h-full flex flex-col justify-center items-center p-10 m-2">
                                {product.image ? (
                                    <img src={`http://127.0.0.1:8000/${product.image}`} className='h-40 w-4/5 p-3 m-auto bg-cover' alt={product.name} />
                                ) : <Rectangle />}
                                <div className="p-2 flex flex-col justify-between">
                                    <p className="text-center truncate">{product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}</p>
                                    <p className='text-xl font-bold text-sky-700 my-4'>₱ {formatMoney(product.price)}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

function NewArrivals() {
    const productResource = createResource(fetchNewArrivalProducts());

    return (
        <section className="min-h-1/2 flex flex-col items-center">
            <div className='container mx-auto px-12'>
                <p className="text-4xl uppercase font-bold tracking-widest text-center m-32">New Arrivals</p>
                <ErrorBoundary fallback={<ErrorFallback/>}>
                    <Suspense fallback={<NewArrivalSkeleton/>}>
                        <NewArrivalList productResource={productResource}/>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </section>
    )
}

export default NewArrivals;
