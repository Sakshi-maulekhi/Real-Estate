import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white overflow-hidden">
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 gap-6 h-full min-h-0">
        {/* LEFT SIDE - FILTER + POSTS */}
        <div className="flex-1 lg:flex-[2] flex flex-col gap-4 h-full min-h-0">
          {/* FILTER - Fixed Height */}
          <div className="flex-none z-10 pr-2">
            <Filter />
          </div>

          {/* POSTS - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 pb-20 space-y-4 custom-scrollbar min-h-0">
            <Suspense
              fallback={
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
                  <div className="animate-spin h-10 w-10 border-t-2 border-purple-500 rounded-full mx-auto"></div>
                  <p className="text-gray-400 mt-4">Loading properties...</p>
                </div>
              }
            >
              <Await
                resolve={data.postResponse}
                errorElement={
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
                    <p className="text-red-400">Error loading properties</p>
                  </div>
                }
              >
                {(postResponse) => (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center sticky top-0 bg-zinc-900/90 backdrop-blur-md p-2 -mx-2 z-20 rounded-lg">
                      <p className="text-gray-400">
                        Found{" "}
                        <span className="text-purple-400 font-semibold">
                          {postResponse.data.length}
                        </span>{" "}
                        properties
                      </p>
                    </div>

                    <div className="space-y-6">
                      {postResponse.data.map((post) => (
                        <Card key={post.id} item={post} />
                      ))}
                    </div>
                  </div>
                )}
              </Await>
            </Suspense>
          </div>
        </div>

        {/* RIGHT SIDE - MAP */}
        <div className="hidden lg:block lg:flex-[1.5] 
  bg-white/5 backdrop-blur-xl border border-white/10 
  rounded-2xl sticky top-4 self-start h-[calc(100vh-2rem)]">

          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400">Loading map...</p>
              </div>
            }
          >
            <Await
              resolve={data.postResponse}
              errorElement={<p className="text-gray-400">Error loading map</p>}
            >
              {(postResponse) => <Map items={postResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ListPage;
