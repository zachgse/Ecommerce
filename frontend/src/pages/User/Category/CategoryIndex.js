import UserLayout from "../Layouts/UserLayout";
import CategoryEdit from "./CategoryEdit";
import { useEffect, useState, useRef } from "react";
import { useLocation,useNavigate,Link } from 'react-router-dom';
import api from "../../../api/ApiLink";
import { RiArrowLeftSLine } from "react-icons/ri";
import { RiArrowRightSLine } from "react-icons/ri";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

function CategoryIndex() {
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('product');
    const itemsPerPage = 10;
    const initialPageNumber = useQuery().get('page') || 1;
    const initialQuery = useQuery().get('q') || '';
    const initialSearchName = useQuery().get('name') || ''; 
    const [page,setPage] = useState(initialPageNumber);
    const [query,setQuery] = useState(initialQuery);
    const [searchName, setSearchName] = useState(initialSearchName);
    const [initialStartIndex,setInitialStartIndex] = useState(0);
    const [initialEndIndex,setInitialEndIndex] = useState(itemsPerPage);
    const [pagination,setPagination] = useState([]);
    const startIndex = (page - 1) * itemsPerPage;
    const [categories,setCategories] = useState([]);
    const [searchedCategories,setSearchedCategories] = useState([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const dropdownRefs = useRef([]);
    const [isCategoryEditModal,setIsCategoryEditModal] = useState(false);
    const [categoryId,setCategoryId] = useState(null);

    const closeCategoryModal = () => {
        setCategoryId('');
        setIsCategoryEditModal(false);
    }

    const toggleDropdown = (index) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
    
    useEffect(() => {
        const handleClickOutsideDropdown = (event) => {
            if (
              dropdownRefs.current.every(
                (ref) => ref && !ref.contains(event.target)
              )
            ) {
              setOpenDropdownIndex(null);
            }
        }

        document.addEventListener('mousedown', handleClickOutsideDropdown);
        return () => {
          document.removeEventListener('mousedown', handleClickOutsideDropdown);
        };
    }, []);

    const buildLink = () => {
        let link = `/user/category/index`;
        const params = [];
    
        if (query) {
            params.push(`q=${query}`);
        }
        if (page) {
            setInitialStartIndex(itemsPerPage * (page - 1));
            setInitialEndIndex(itemsPerPage * page);
            params.push(`page=${page}`);
        }
        if (searchName) {
            params.push(`name=${searchName}`);
        }
        if (params.length > 0) {
            link += `?${params.join('&')}`;
        }
        return link;
    }

    useEffect(()=>{
        const fetchCategories = async() => { 
            try {
                const link = buildLink();
                const formData = new FormData();
                if (query) {
                    formData.append('query', query);
                }
                if (searchName) {
                    formData.append('name', searchName);
                }
                const response = await api.post('category/search',formData);
                setCategories(response.data.categories);
                setSearchedCategories(response.data.categories.slice(initialStartIndex,initialEndIndex))
                navigate(link);
            } catch (error) {
                console.error(error);
            }
        }
        
        fetchCategories();
    },[initialStartIndex, initialEndIndex, query,page, searchName,navigate, categoryId]);

    useEffect(() => {
        if (categories && searchedCategories){
            const temp = [];
            for (let index = 0; index < categories.length / itemsPerPage; index++) {
                temp.push(index);
            }
            setPagination(temp);
        }
    },[categories,searchedCategories]);

    const toggleName = () => {
        searchName ? 
            searchName === 'ASC' ? setSearchName('DESC') : setSearchName('ASC') 
        : setSearchName('ASC');
        setInitialStartIndex(0);
        setInitialEndIndex(itemsPerPage);
        setPage(1);
    }

    const clearFilter = () => {
        setQuery('');
        setSearchName('');
        setInitialStartIndex(0);
        setInitialEndIndex(itemsPerPage);
        setPage(initialPageNumber);
    }

    const Page = (index) => {
        const link = buildLink();
        if (index == 0){
            setInitialStartIndex(0);
            setInitialEndIndex(itemsPerPage);
            setPage(index+1);
        } else {
            index += 1;
            setInitialStartIndex(itemsPerPage * (index - 1));
            setInitialEndIndex(itemsPerPage * index);
            setPage(index);
        }
        navigate(link);
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(prevPage => {
                const pageInt = parseInt(prevPage,10);
                if (pageInt > 1) {
                    return pageInt - 1;
                }
                return pageInt;
            })
        }
    }

    const nextPage = () => {
        if (page < pagination.length) {
            setPage(nextPage => {
                const pageInt = parseInt(nextPage, 10);
                if (page < pagination.length) {
                    return pageInt + 1;
                }
                return pageInt;
            });
   
        }
    }

    return (
        <UserLayout setActivePage={setActivePage} activePage={activePage}>
            {isCategoryEditModal && categoryId && (
                <CategoryEdit closeModal={closeCategoryModal} categoryId={categoryId}/>
            )}
            <p className="text-2xl font-bold my-5">List of Categories</p>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring focus-within:ring-blue-300 w-auto px-3 py-2 mt-10">
                <input type="text" name="query" value={query} onChange={(e) => setQuery(e.target.value)}
                    className="ml-2 flex-1 bg-transparent outline-none" placeholder="Search..." autoComplete='off'/>
                <svg className="w-6 h-6 hover:text-sky-700 hover:cursor-pointer" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" 
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            <div className='w-full min-h-20 max-h-auto bg-gray-200 flex flex-wrap justify-start items-center gap-4 my-8 p-8'>
                <p className='md:me-4'>Sort By</p>
                <div onClick={toggleName} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center gap-2 p-4 hover:cursor-pointer'>
                    Name
                    {searchName && (
                        searchName === 'ASC' ? (
                            <FaArrowUp className="h-3 w-3" />
                        ) : (
                            <FaArrowDown className="h-3 w-3" />
                        )
                    )}  
                </div>
                <div onClick={clearFilter} className='min-w-20 w-auto min-h-8 max-h-auto bg-white flex items-center justify-center p-4 hover:cursor-pointer'>Clear Filter</div>
            </div>
            <div className="flex justify-end mb-8">
                <Link to="/user/category/add" className="bg-sky-700 hover:opacity-90 text-white px-12 py-4 rounded-md w-auto">
                    Add Category
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="text-center w-full">
                    <thead className="border-solid border border-e1e1e1 h-20">
                        <tr>
                            <th className="text-gray-500">#</th>
                            <th className="text-gray-500">Name</th>
                            <th className="text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedCategories && searchedCategories.length > 0 ? (
                            searchedCategories.map((category,index) => {
                                return (
                                    <tr key={category.id} className="border-b border-t border-gray-300">
                                        <td className="py-4">{startIndex + index + 1}</td>
                                        <td className="py-4">{category.name}</td>
                                        <td className="py-4">
                                            <div className="relative inline-block text-left" ref={(e) => (dropdownRefs.current[index] = e)}>
                                            <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                                id="options-menu" aria-haspopup="true" aria-expanded={openDropdownIndex === index} onClick={() => toggleDropdown(index)}>
                                                Action 
                                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" clipRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"/>
                                                </svg>
                                            </button>
                                            {openDropdownIndex === index && (
                                                <div className="z-30 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                                                    role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                    <div className="text-center py-1" role="none">
                                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                                                            onClick={() => {
                                                                setCategoryId(category.id);
                                                                setIsCategoryEditModal(true);
                                                            }}>
                                                            Edit
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                            </div>
                                        </td>
                                    </tr>  
                                )
                            })
                        ) : (
                            <tr>
                                <td>No categories yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <br/>
            {pagination && (
                <div className='flex flex-row mb-16'>
                    <RiArrowLeftSLine className={`${page == 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} w-8 h-8`} onClick={prevPage}/>
                    {pagination && pagination.length > 0 && (
                        pagination.map(index => {
                            return (
                                <div className={(index+1) == page ?  
                                    `hover:cursor-pointer border border-sky-700 bg-sky-700 text-white w-8 h-8 text-center`
                                    : `hover:cursor-pointer border border-gray-300 bg-white text-black w-8 h-8 text-center`}
                                    key={index + 1} onClick={() => Page(index)}>
                                        {index + 1}
                                </div>
                            )
                        })
                    )}
                    <RiArrowRightSLine className={`${page == pagination.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} w-8 h-8`} onClick={nextPage}/>
                </div>
            )}
        </UserLayout>
    )
}

export default CategoryIndex;


