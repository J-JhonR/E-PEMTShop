import Banner from "../components/HomeComponents/Banner";
import Hero from "../components/HomeComponents/Hero";
import Categories from "../components/HomeComponents/Categories";
import FlashSale from "../components/HomeComponents/FlashSale";
import PopularProducts from "../components/HomeComponents/PopularProducts";


export default function Home() {
  return (
    <>
      <Banner />
      <Hero />
      <Categories />
      <FlashSale />
      <PopularProducts />
      
    </>
  );
}
