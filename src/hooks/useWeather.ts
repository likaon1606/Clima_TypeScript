import axios from "axios";
import { set, z } from 'zod'
// import { object, string, number, InferOutput, parse } from 'valibot'
import { SearchType } from "../types";
import { useMemo, useState } from "react";

//* TYPE GUARD O ASERTION
// function isWeatherResponse(weather : unknown) : weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number'
//   )
// }

//? Zood Es de las mejores opciones 
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})
export type Weather = z.infer<typeof Weather>

//? Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number()
//   })
// })
// type Weather = InferOutput<typeof WeatherSchema>

export default function useWeather() {

  const [weather, setWeather] = useState<Weather>({
    name: '',
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0
    }
  })

  const [loading, setLoading] = useState(false)
  
  const fetchWeather = async (search: SearchType) => { 
    const appId = import.meta.env.VITE_API_KEY
    setLoading(true)
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

      const { data } = await axios(geoUrl)
      
      const lat = data[0].lat      
      const lon = data[0].lon

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

      //* Castear el type
      // const {data: weatherResul} = await axios<Weather>(weatherUrl)
      // console.log(weatherResul.name);

      //* Type Guards
      // const {data: weatherResul} = await axios(weatherUrl)
      // const result = isWeatherResponse(weatherResul)
      // if (result) {
      //   console.log(weatherResul.name);
      // } else {
      //   console.log('Respuesta mal formada');
      // }


      //? Zod * Es de las mejores alternativas para validar el JSON con el schema para tipar las respuestas que se obtiene con "axios"

      const {data: weatherResul} = await axios<Weather>(weatherUrl)
      const result = Weather.safeParse(weatherResul)
      if (result.success) {
        setWeather(result.data)
      } else {
        console.log('Respuesta mal formada');
        
      }

      //? Valibot Es la "MEJOR" para validar el JSON con el schema para tipar las respuestas que se obtiene con "axios"
      // const {data: weatherResul} = await axios(weatherUrl)
      // const result = parse(WeatherSchema, weatherResul)
      // if (result) {
      //   console.log(result.name);
      //   console.log(result.main.temp);
      // }
      
    } catch (error) {
      console.log(error);
      
    } finally {
      setLoading(false)
    }
    
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return {
    weather,
    loading,
    fetchWeather,
    hasWeatherData
  }
}