import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";

const STATS = [
  { value: "16+", label: "Years Experience" },
  { value: "200", label: "Awards Gained" },
  { value: "2000+", label: "Properties Ready" },
];

const FEATURES = [
  {
    title: "Verified Listings",
    description: "All properties are verified and authenticated",
  },
  {
    title: "Advanced Search",
    description: "Powerful filters to find exactly what you need",
  },
  {
    title: "Direct Contact",
    description: "Message owners instantly in our platform",
  },
];

// --- Sub-Components ---

const StatCard = ({ value, label }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center">
    <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
      {value}
    </p>
    <p className="text-sm text-gray-400 mt-2">{label}</p>
  </div>
);

const FeatureCard = ({ title, description }) => (
  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center hover:shadow-purple-900/20 transition group">
    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl mx-auto mb-6 group-hover:scale-110 transition-transform" />
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);



function HomePage() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="h-full w-full bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white overflow-y-auto custom-scrollbar">

      <section className="relative overflow-hidden pt-20 pb-20">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-stretch">

          
          <div className="space-y-8 flex flex-col justify-between">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Find Your{" "}
                <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
                  Dream Property
                </span>
              </h1>

              <p className="text-gray-400 text-lg max-w-xl">
                PropertyHub is your trusted platform for discovering residential
                properties with verified listings and seamless communication.
              </p>
            </div>

            <SearchBar />
          </div>

         
          <div className="hidden lg:flex items-end">
            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-2xl">
              <img
                src="/bg.png"
                alt="Property showcase"
                className="w-full rounded-2xl object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-5 border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why{" "}
            <span className="bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
              PropertyHub
            </span>
            ?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide the tools and support you need for a seamless property search experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

    </div>
  );
}

export default HomePage;