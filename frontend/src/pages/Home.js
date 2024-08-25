import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Test from '../components/Test';
import Carousel from '../components/Homepage/Carousel';
import Arrivals from '../components/Homepage/Arrivals';
import Categories from '../components/Homepage/Categories';
import Trending from '../components/Homepage/Trending';

function Home() {
    return (
        <>
            <Test/>
            <Carousel/>
            <Arrivals/>
            <Trending/>
            <Footer/>
        </>
    );
}

export default Home;
