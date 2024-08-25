import { useState,Suspense } from "react";
import CanvasJSReact from '@canvasjs/react-charts';
import UserLayout from "../Layouts/UserLayout";
import { createResource,fetchDashboardTransaction,fetchDashboardUser,fetchDashboardProductsTrending,fetchDashboardProductsCategory } from "../../../api/FetchData";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Skeleton() {
    return (
        <>
            <div className="bg-gray-200 w-72 h-72 rounded-full m-auto"></div>
        </>
    )
}

function DashboardTransaction({transactionResource}) {
    const transactions = transactionResource.read();
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        data: [{
            type: "pie",
            startAngle: 0,
            toolTipContent: "<b>{label}</b>: {y} order/s",
            indexLabel: "{label}",
            dataPoints: [
                { y: transactions.pending, label: "Pending" },
                { y: transactions.receive, label: "Shipped" },
                { y: transactions.completed, label: "Completed" },
            ]
        }]
    }

    return (
        <>
            <CanvasJSChart options = {options}/>
        </>
    )
}

function DashboardUser({userResource}) {
    const users = userResource.read();
    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        axisX: {
            interval: 1,
        },
        data: [{
            type: "line",
            toolTipContent: "{label}: {y} users",
            dataPoints: [
                { label: "Jan", y: users[1] }, 
                { label: "Feb", y: users[2] }, 
                { label: "Mar", y: users[3] }, 
                { label: "Apr", y: users[4] },
                { label: "May", y: users[5] },  
                { label: "Jun", y: users[6] },  
                { label: "Jul", y: users[7] }, 
                { label: "Aug", y: users[8] }, 
                { label: "Sep", y: users[9] },  
                { label: "Oct", y: users[10] }, 
                { label: "Nov", y: users[11] }, 
                { label: "Dec" , y: users[12] }  
            ]
        }]
    }
    
    return (
        <>
            <CanvasJSChart options = {options}/>
        </>
    )
}

function DashboardProductTrending({productTrendingResource}) {
    const products = productTrendingResource.read();
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        data: [{
            type: "column",
            toolTipContent: "<b>{label}</b>: {y} pc/s",
            dataPoints: [
                { label: products[0]['name'], y: products[0]['total_sold']},
                { label: products[1]['name'], y: products[1]['total_sold']},
                { label: products[2]['name'], y: products[2]['total_sold']},
                { label: products[3]['name'], y: products[3]['total_sold']},
                { label: products[4]['name'], y: products[4]['total_sold']},
            ]
        }]
    }

    return (
        <>
            <CanvasJSChart options = {options}/>
        </>
    )
}

function DashboardProductCategory({productCategoryResource}) {
    const products = productCategoryResource.read();
    const dataPoints = products.map(product => ({
        label: product.category__name,
        y: product.product_count
    }));
    const options = {
        exportEnabled: true,
        animationEnabled: true,
        data: [{
            type: "column",
            toolTipContent: "<b>{label}</b>: {y} product/s",
            dataPoints: dataPoints
        }]
    }

    return (
        <>
            <CanvasJSChart options = {options}/>
        </>
    )
}


function DashboardIndex() {
    const [activePage, setActivePage] = useState('dashboard');
    const transactionResource = createResource(fetchDashboardTransaction());
    const userResource = createResource(fetchDashboardUser());
    const productTrendingResource = createResource(fetchDashboardProductsTrending());
    const productCategoryResource = createResource(fetchDashboardProductsCategory());

    return (
        <UserLayout setActivePage={setActivePage} activePage={activePage}>
            <p className="text-2xl font-bold my-5">Dashboard</p>
            <div className="flex md:flex-row flex-col space-x-8 mb-24">
                <div className="flex-1">
                    <p className="text-xl font-bold text-center mb-12">Orders</p>
                    <Suspense fallback={<Skeleton/>}>
                        <DashboardTransaction transactionResource={transactionResource} />
                    </Suspense>
                </div>
                <div className="flex-1">
                    <p className="text-xl font-bold text-center mb-12">Registered users per month</p>
                    <Suspense fallback={<Skeleton/>}>
                        <DashboardUser userResource={userResource} />
                    </Suspense>
                </div>
            </div>

            <div className="flex md:flex-row flex-col space-x-8 mb-24">
                <div className="flex-1">
                    <p className="text-xl font-bold text-center mb-12">Top selling products</p>
                    <Suspense fallback={<Skeleton/>}>
                        <DashboardProductTrending productTrendingResource={productTrendingResource}/>
                    </Suspense>
                </div>
                <div className="flex-1">
                    <p className="text-xl font-bold text-center mb-12">Products per category</p>
                    <Suspense fallback={<Skeleton/>}>
                        <DashboardProductCategory productCategoryResource={productCategoryResource}/>
                    </Suspense>
                </div>
            </div>
        </UserLayout>
    )
}

export default DashboardIndex;


