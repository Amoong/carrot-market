import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="sm:bg-red-400 md:bg-teal-400 lg:bg-indigo-400 xl:bg-yellow-400 2xl:bg-pink-400">
      <input
        type="file"
        className="file:transition-colors file:hover:text-purple-400 file:hover:bg-white file:hover:border-purple-400 file:hover:border file:cursor-pointer file:border-0 file:rounded-xl file:px-5 file:text-white file:bg-purple-500"
      />
      <p className="sm:hover:bg-pink-200 first-letter:text-7xl first-letter:hover:text-pink-500">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, atque sit
        ad non sunt dolorem officiis accusamus voluptates corrupti quam!
      </p>
    </div>
  );
};

export default Home;
