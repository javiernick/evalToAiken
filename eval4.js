const fs = require('fs');

const RESPUESTAS = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)', 'G)', 'H)', 'I)'];
const RUTA_FOLDER = './eval/';

let toAkien = (archivo, callback) => {

    const lineReader = require('line-reader');

    let numrespuesta = 0;
    let numpregunta = 0;
    let lineaok = false;
    let fichero = "";
    let RESPUESTASCORRECTAS = [];

    lineReader.eachLine(archivo, function(line, last) {
        
        //console.log(last);

        
        /* respuestas validas */
        if (line.match(/var res = new Array/)) {
            line = line.replace(/var res = new Array\(/, " ");
            line = line.replace(/\);/, " ");
            line = line.replace(/(\r\n|\n|\r|\t)/gm, "");
            line = line.replace(/\"/g,"").toUpperCase();
            RESPUESTASCORRECTAS = line.split(","); 
            
            //console.log(RESPUESTASCORRECTAS);

            
        }

        line = line.replace("';","");
        line = line.replace(" = '","");

        /* enunciado, resetea el iterador de respuesta */
        if (line.match(/var E(\d)*/)) {
            line = line.replace(/var E(\d)*/, "");
            numrespuesta = 0;
            lineaok = true;
            fichero += line;
        }
        /* respuesta */
        if (line.match(/var P(\d)*/)) {
            line = line.replace(/var P(\d)*/, RESPUESTAS[numrespuesta]+" ");
            numrespuesta++;
            lineaok = true;
            fichero += line;
        }

        /* justificacion */
        if (line.match(/var J(\d)*/)) {
            fichero =  fichero + "ANSWER: " + RESPUESTASCORRECTAS[numpregunta];
            line = "";
            lineaok = true;
            fichero += line;
            //fichero += '\r\n';
            numpregunta++;
            
        }

        if (lineaok) {
            //console.log(line);
            fichero += '\r\n';
        }

        if (last) {

            callback(fichero);
            /*
            fs.writeFile(archivo.replace('.html', '.txt'), fichero, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
            
                // success case, the file was saved
                console.log('Lyric saved!');
            });
            return false; // stop reading
            */
            
        }


    });

}

const getFicheros = ( ruta, callback ) => {

    fs.readdir(ruta, function (err, archivos) {
        if (err) {
            onError(err);
        return;
        }
        const txtFiles = archivos.filter(el => /\.html$/.test(el));
        //console.log(txtFiles);
        callback(txtFiles);
    })
}

getFicheros( RUTA_FOLDER, ( ficheros ) =>{
    
    for (let index = 0; index < ficheros.length; index++) {

        const fichero = RUTA_FOLDER+ficheros[index];

        toAkien(fichero, ( contenido ) => {
            //console.log(fichero);
            fs.writeFile(fichero.replace('.html', '.txt'), contenido, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
                console.log(`fichero ${fichero} creado!`);
                // success case, the file was saved
                //console.log('Lyric saved!');
            });
        })
    }

})

