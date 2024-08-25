import SampleRound from "../SampleRound";

function Categories(){
    return(
        <>
            <section className="h-1/2 flex flex-col items-center">
                <div className='container mx-auto px-12'>
                    <p className="text-4xl uppercase font-bold tracking-widest text-center m-32">Categories</p>
                    <div className="grid lg:grid-cols-8 md:grid-cols-4 xs:grid-cols-1 gap-12">
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                        <div className="m-auto">
                            <SampleRound/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Categories;