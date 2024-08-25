function Footer(){
    const year = (() => {
        const date = new Date();
        return date.getFullYear();
    })();
    return(
        <>
            <section className="h-2/3 flex justify-center p-6 mt-64">
                <div className="relative bottom-0">
                    <p className="">© E-commerce {year}</p>
                </div> 
            </section>
        </>
    );
}

export default Footer;