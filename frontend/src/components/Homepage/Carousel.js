import imgBanner from '../../img/ecommerce.jpg';

function Carousel() {
  return(
    <>
      <section className="h-screen flex justify-center items-center">
        <img src={imgBanner} className="w-4/5 h-3/5"/>
      </section>
    </>
  );
}

export default Carousel;
