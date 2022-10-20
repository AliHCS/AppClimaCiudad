require('dotenv').config()


const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');



const main = async () => {

    const busquedas = new Busquedas()
    let opt

    do {

        opt = await inquirerMenu()

        switch (opt) {
            case '1':
                //mostrar mensaje y buscar el lugar
                const termino = await leerInput('Ciudad: ')

                //seleccionar el lugar
                const lugares = await busquedas.ciudad(termino)
                const id = await listarLugares(lugares)
                if (id === '0') continue
                const lugarSelec = lugares.find(l => l.id === id)
                
                //Guardar en DB 
                busquedas.agregarHistorial( lugarSelec.nombre )
                
                //Datos del clima
                const clima = await busquedas.climaCiudad(lugarSelec.lat, lugarSelec.lng)


                //mostramos resultados 
                console.clear()
                console.log('\nInformaciond de la ciudad\n'.green)
                console.log('Ciudad: ', lugarSelec.nombre)
                console.log('Lat: ', lugarSelec.lat)
                console.log('Lng: ', lugarSelec.lng)
                console.log('Temperatura: ', clima.temp)
                console.log('Minima: ', clima.min)
                console.log('Maxima: ', clima.max)
                console.log('Como esta el clima: ', clima.desc)
                break;
            case '2':

                /* busquedas.historial.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${ idx} ${lugar}`)
                }); */
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${ idx} ${lugar}`)
                });

                break;
            default:
                break;
        }

        if (opt !== '0') await pausa()

    } while (opt !== '0');

}

main()