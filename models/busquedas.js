const fs = require('fs')
//implementacion de axios para peticiones HTTP
const axios = require('axios')



class Busquedas {

    historial = []
    dbPath='./db/database.json'

    constructor() {
        //Leer DB si Existe
        this.leerBD()
    }


    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ')
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ')
        })
    }


    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es',
        }
    }

    async ciudad(lugar = '') {
        try {

            //peticion HTTP

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            const resp = await intance.get();


            /* const respuesta = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Madrid.json?language=es&access_token=pk.eyJ1IjoiYWxpZ3VzIiwiYSI6ImNsOWc2Y2x3NTAxYWYzdW9ieHduZXY4N3EifQ.m8So28589Ucb_0rZ4tvNlw&limit=5') */
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))//retorna todas las ciudades con ese lugar

        } catch (error) {
            return []
        }

    }

    async climaCiudad(lat, lon) {
        try {

            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon}
            })

            const resp = await intance.get();
            const { weather, main } = resp.data

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        } catch (error) {

        }

    }


    agregarHistorial (lugar = ''){
        //prevenir duplicados
        if (this.historial.includes( lugar.toLocaleLowerCase())) {
            
        }

        this.historial = this.historial.splice(0,5)


        this.historial.unshift( lugar.toLocaleLowerCase() )

        //grabar en BD 
        this.guardarBD()
    }

    guardarBD(){
        const payload = {
            historial: this.historial
        }


        fs.writeFileSync(this.dbPath, JSON.stringify( payload ) )
    }

    leerBD(){

        //comprobar si existe
        if (!fs.existsSync(this.dbPath)) return

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse( info )
         
        this.historial = data.historial
    }
}


module.exports = Busquedas