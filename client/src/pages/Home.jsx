import React from "react";
import Hero from "../components/home/Hero";
import CategorySectoin from "../components/home/CategorySectoin";
import Technology from "../components/home/technology";
import Occasion from "../components/home/occasion";
import Trending from "../components/home/trending";
import DiscoverMore from "../components/home/discoverMore";


const Home = () => {
  return (
    <div>
      <Hero />
      <CategorySectoin />
      <Trending />
      <Technology />
      <Occasion />
    </div>
  );
};

export default Home;
