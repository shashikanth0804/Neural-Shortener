import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();
  console.log("RedirectLink component loaded with id:", id);

  const {loading, data, fn, error} = useFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    console.log("useEffect triggered, calling fn()");
    fn();
  }, []);

  useEffect(() => {
    console.log("Data effect triggered:", {loading, data, error});
    if (!loading && data && data.original_url) {
      console.log("Found URL data, calling fnStats:", data);
      fnStats();
    } else if (!loading && !data) {
      console.log("No data found for ID:", id);
    }
  }, [loading, data]);

  console.log("Current state:", {loading, data, error, loadingStats});

  // If there's an error or no data found, show a message
  if (!loading && (error || !data)) {
    console.log("Showing error page - Error or no data:", error, data);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Link not found</h1>
        <p className="text-gray-600 mt-2">The short URL "{id}" doesn't exist.</p>
        <p className="text-sm text-gray-500 mt-2">Debug: loading={loading.toString()}, error={error?.message}, data={JSON.stringify(data)}</p>
      </div>
    );
  }

  if (loading || loadingStats) {
    console.log("Showing loading state");
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  console.log("Component render complete - should have redirected by now");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>If you see this, something went wrong with the redirect.</p>
      <p className="text-sm text-gray-500 mt-2">Debug info: {JSON.stringify({loading, data, error, loadingStats})}</p>
    </div>
  );
};

export default RedirectLink;