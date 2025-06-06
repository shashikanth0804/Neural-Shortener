import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();

  const {loading, data, fn, error} = useFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data && data.original_url) {
      console.log("Found URL data:", data);
      fnStats();
    } else if (!loading && !data) {
      console.log("No data found for ID:", id);
    }
  }, [loading, data]);

  // If there's an error or no data found, show a message
  if (!loading && (error || !data)) {
    console.log("Error or no data:", error, data);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Link not found</h1>
        <p className="text-gray-600 mt-2">The short URL "{id}" doesn't exist.</p>
      </div>
    );
  }

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;