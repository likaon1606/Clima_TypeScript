import axios from "axios";
import { z } from 'zod'
import { SearchType } from "../types";

//* Zood

const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})

type Weather = z.infer<typeof Weather>

export default function useWeather() {
  
  const fetchWeather = async (search: SearchType) => {
   
    const appId = import.meta.env.VITE_API_KEY

    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

      const { data } = await axios(geoUrl)
      
      const lat = data[0].lat      
      const lon = data[0].lon

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      // Castear el type
      // const {data: weatherResul} = await axios<Weather>(weatherUrl)
      // console.log(weatherResul.name);

      //? Zod
      const {data: weatherResul} = await axios<Weather>(weatherUrl)
      const result = Weather.safeParse(weatherResul)
      if (result.success) {
        console.log(result.data.name);
        console.log(result.data.main.temp);
      } else {
        console.log('Respuesta mal formada');
        
      }
      

    } catch (error) {
      console.log(error);
      
    }
    
  }

  return {
    fetchWeather
  }
}