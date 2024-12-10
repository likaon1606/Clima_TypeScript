import axios from "axios";
import { SearchType } from "../types";

export default function useWeather() {
  
  const fetchWeather = async (search: SearchType) => {
   
    const appId = '4b1b699bc5f57c5b2b8c229af2150401'

    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

      const { data } = await axios(geoUrl)
      console.log(data);
      

    } catch (error) {
      console.log(error);
      
    }
    
  }

  return {
    fetchWeather
  }
}