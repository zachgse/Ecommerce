import React, { useEffect, useState } from 'react';
import { useLocation,Link,useNavigate } from 'react-router-dom';
import api from '../api/ApiLink';
import Test from '../components/Test';
import Rectangle from '../components/Rectangle';
import { formatMoney } from '../utils/Helper';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiArrowRightSLine } from "react-icons/ri";

function SearchBak() {
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const navigate = useNavigate();
    const query = useQuery().get('q');
    const productsPerPage = 8;
    const initialPageNumber = useQuery().get('page') || 1; //get page from url (for link copy)
    const initialSearchPrice = useQuery().get('price') || ''; //get price from url (for link copy)
    const initialSearchName = useQuery().get('name') || ''; //get name from url (for link copy)
    const [page,setPage] = useState(initialPageNumber) //for querying of page
    const [searchPrice, setSearchPrice] = useState(initialSearchPrice); //for querying of price
    const [searchName, setSearchName] = useState(initialSearchName); //for querying of name
    const [searchedProducts, setSearchedProducts] = useState([]); //to check the searched products
    const [totalProducts,setTotalProducts] = useState([]); //to check how many total products
    const [initialStartIndex,setInitialStartIndex] = useState(0); //for slicing (start)
    const [initialEndIndex,setInitialEndIndex] = useState(productsPerPage); //for slicing (end)
    const [totalPageNumber,setTotalPageNumber] = useState([]); //total number of pages

    //main component
    const buildLink = () => {
        let link = `/search?q=${query}`;
        if (page) {
            setInitialStartIndex(productsPerPage * (page - 1));
            setInitialEndIndex(productsPerPage * page);
            link += `&page=${page}`;
        }
        if (searchPrice) {
            link += `&price=${searchPrice}`;
        }
        if (searchName) {
            link += `&name=${searchName}`;
        }
        return link;
    }

    //SUSPENSE 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const link = buildLink();
                const formData = new FormData();
                formData.append('query', query);
                if (searchPrice) {
                    formData.append('price', searchPrice);
                }
                if (searchName) {
                    formData.append('name', searchName);
                }
                const response = await api.post('test/product/search', formData);
                setTotalProducts(response.data.products);
                setSearchedProducts(response.data.products.slice(initialStartIndex, initialEndIndex));
                navigate(link);
            } catch (error) {
                console.error(error);
            }
        };

        if (query) {
            fetchProducts();
        }
    }, [searchPrice,searchName,query,initialStartIndex,initialEndIndex,page,navigate]);

    //main component
    useEffect(() => {
        if(searchedProducts && totalProducts){
            const pageNumber = totalProducts.length / productsPerPage;
            const temp = [];
            for (let index = 0; index < pageNumber; index++) {
                temp.push(index)
            }
            setTotalPageNumber(temp);
        }
    },[searchedProducts,totalProducts])

    //main component
    const priceAsc = () => {
        setSearchPrice('ASC');
        setSearchName('');
        setInitialStartIndex(0);
        setInitialEndIndex(productsPerPage);
        setPage(initialPageNumber);
    }

    //main component
    const priceDesc = () => {
        setSearchPrice('DESC');
        setSearchName(''); 
        setInitialStartIndex(0);
        setInitialEndIndex(productsPerPage);
        setPage(initialPageNumber);
    }

    //main component
    const nameAsc = () => {
        setSearchName('ASC');
        setSearchPrice('');
        setInitialStartIndex(0);
        setInitialEndIndex(productsPerPage);
        setPage(initialPageNumber);
    }

    //main component
    const nameDesc = () => {
        setSearchName('DESC');
        setSearchPrice(''); 
        setInitialStartIndex(0);
        setInitialEndIndex(productsPerPage);
        setPage(initialPageNumber);
    }

    //product info component
    function Rating({ id }) {
        const [ratings, setRatings] = useState([]);
    
        useEffect(() => {
            const fetchRatings = async () => {
                try {
                    const response = await api.get(`rating/product_ratings/${id}`);
                    setRatings(response.data.ratings);
                } catch (error) {
                    console.error(error);
                }
            };
    
            fetchRatings();
        }, [id]);
    
        const stars = [];
        let avg = 0;
    
        if (ratings.length > 0) {
            for (let index = 0; index < ratings.length; index++) {
                avg += ratings[index].star;
            }
            avg /= ratings.length;
            for (let index = 0; index < parseInt(avg); index++) {
                stars.push(<FaStar key={`full-${index}`} className='flex inline-flex justify-start text-custom-yellow mt-1 text-xs' />);
            }
            let temp = 5 - parseInt(avg);
            for (let index = 0; index < temp; index++) {
                stars.push(<FaRegStar key={`empty-${index}`} className='flex inline-flex justify-start text-custom-yellow mt-1 text-xs' />);
            }
        } else {
            for (let index = 0; index < 5; index++) {
                stars.push(<FaRegStar key={`none-${index}`} className='flex inline-flex text-custom-yellow mt-1 text-xs' />);
            }
        }
    
        return (
            <div className='flex md:flex-row flex-col'>
                <span className='flex flex-inline ms-2'>{stars}</span>
            </div>
        );
    }

    //main component
    const Page = (index) => {
        if (index == 0){
            setInitialStartIndex(0);
            setInitialEndIndex(productsPerPage);
            setPage(index+1);
        } else {
            index += 1;
            setInitialStartIndex(productsPerPage * (index - 1));
            setInitialEndIndex(productsPerPage * index);
            setPage(index);
        }
        navigate(`/search?q=${query}&page=${page}`);
    }

    //main component
    const prevPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const pageInt = parseInt(prevPage, 10);
                if (pageInt > 1) {
                    return pageInt - 1;
                }
                return pageInt;
            });
        }
    };

    //main component
    const nextPage = () => {
        if (page < totalPageNumber.length) {
            setPage(nextPage => {
                const pageInt = parseInt(nextPage, 10);
                if (page < totalPageNumber.length) {
                    return pageInt + 1;
                }
                return pageInt;
            });
   
        }
    }

    return(
        <>
            <Test/>
            <section className="h-screen container mx-auto px-12">
                <p className='text-xl mt-8'>Search result for: {query} ({totalProducts.length} results found)</p>
                <div className='w-full min-h-20 max-h-auto bg-gray-200 flex flex-wrap justify-start items-center gap-4 my-16 p-8'>
                    <p className='md:me-4'>Sort By</p>
                    <div onClick={priceAsc} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center p-4 hover:cursor-pointer'>Price Low to High</div>
                    <div onClick={priceDesc} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center p-4 hover:cursor-pointer'>Price High to Low</div>
                    <div onClick={nameAsc} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center p-4 hover:cursor-pointer'>Alphabetical A-Z</div>
                    <div onClick={nameDesc} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center p-4 hover:cursor-pointer'>Alphabetical Z-A</div>
                </div>
                
                {totalPageNumber && (
                    <div className='flex flex-row mb-16'>
                        <RiArrowLeftSLine className={`${page == 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} w-8 h-8`} onClick={prevPage}/>
                        {totalPageNumber && (
                            totalPageNumber.map((pageNumber,index) => {
                                return(
                                    <div className={(index+1) == page ?  
                                        `hover:cursor-pointer border border-sky-700 bg-sky-700 text-white w-8 h-8 text-center`
                                        : `hover:cursor-pointer border border-gray-300 bg-white text-black w-8 h-8 text-center`}
                                        key={index + 1} onClick={() => Page(index)}>
                                            {pageNumber + 1}
                                    </div>
                                )
                            })
                        )}
                        <RiArrowRightSLine className={`${page == totalPageNumber.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} w-8 h-8`} onClick={nextPage}/>
                    </div>
                )}

                
                <div className='flex flex-wrap gap-1 justify-start items-start'>
                    {/* PRODUCT INFO SUSPENSE */}
                    {searchedProducts ? searchedProducts.map(product => (
                        <Link key={product.id} to={`/product/${product.id}`} className="m-1 block w-44 h-auto max-w-auto md:m-0 m-auto">

                            <div className="bg-white trending-card">
                                {product.image ? (
                                    <img src={`http://127.0.0.1:8000/${product.image}`} className='h-36 w-4/5 p-3 m-auto bg-cover' alt={product.name} />
                                ) : <Rectangle />}
                                <div className="p-2 flex flex-col justify-between text-center">
                                    <div className='flex flex-inline justify-center items-start gap-2 text-xs'>
                                        <Rating id={product.id} /> 
                                    </div>
                                    <p className="text-center truncate text-md mt-1">{product.name.length > 20 ? `${product.name.substring(0, 20)}...` : product.name}</p>
                                    <p className='text-md text-left font-bold text-sky-700 mt-2'>₱ {formatMoney(product.price)}</p>

                                </div>
                            </div>
                        </Link>
                    )) :
                    (
                        <>
                            <p>No products found.</p>
                        </>
                    )}
                </div>
            </section>
        </>
    )
}

export default SearchBak;