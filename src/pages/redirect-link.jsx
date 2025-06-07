import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";

const RedirectLink = () => {
  const {id} = useParams();
  console.log("RedirectLink component loaded with id:", id);

  const {loading, data, fn} = useFetch(getLongUrl, id);

  useEffect(() => {
    console.log("useEffect triggered, calling fn()");
    fn();
  }, []);

  useEffect(() => {
    console.log("Data effect triggered:", {loading, data});
    
    if (!loading && data && data.original_url) {
      console.log("Found URL data, storing click and redirecting:", data);
      
      // Store the click and then redirect
      storeClicks({
        id: data.id,
        originalUrl: data.original_url,
      }).then(() => {
        console.log("Click stored, redirecting to:", data.original_url);
        // Redirect to the original URL
        window.location.href = data.original_url;
      }).catch((error) => {
        console.error("Error storing click, but still redirecting:", error);
        // Even if click recording fails, still redirect
        window.location.href = data.original_url;
      });
    }
  }, [loading, data]);

  console.log("Current state:", {loading, data});

  // If there's an error or no data found after loading is complete
  if (!loading && !data) {
    console.log("No data found for ID:", id);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Link not found</h1>
        <p className="text-gray-600 mt-2">The short URL "{id}" doesn't exist.</p>
        <a href="/" className="text-blue-500 hover:underline mt-4">
          Go back to homepage
        </a>
      </div>
    );
  }

  // Show loading state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      <p>Redirecting...</p>
    </div>
  );
};

export default RedirectLink;