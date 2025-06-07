import {UAParser} from "ua-parser-js";
import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  const {data, error} = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async ({id, originalUrl}) => {
  console.log("Storing click for:", {id, originalUrl});
  
  if (!originalUrl) {
    console.error("No original URL provided");
    throw new Error("No original URL provided");
  }

  try {
    const res = parser.getResult();
    const device = res.type || "desktop";

    // Get location data
    let city = "Unknown";
    let country = "Unknown";
    
    try {
      const response = await fetch("https://ipapi.co/json");
      const locationData = await response.json();
      city = locationData.city || "Unknown";
      country = locationData.country_name || "Unknown";
    } catch (locationError) {
      console.warn("Could not fetch location data:", locationError);
    }

    // Record the click
    const {error} = await supabase.from("clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    if (error) {
      console.error("Error inserting click:", error);
    } else {
      console.log("Click recorded successfully");
    }

    return {success: true, originalUrl};
  } catch (error) {
    console.error("Error in storeClicks:", error);
    throw error;
  }
};