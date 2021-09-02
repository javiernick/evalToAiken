const LineByLineReader = require('line-by-line');
const fs = require('fs');

const RESPUESTAS = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)', 'G)', 'H)', 'I)'];
const RUTA_FOLDER = './eval/';

const toAkien = (archivo, callback) => {

    //console.log(archivo);
        
    

    let numrespuesta = numpregunta = 0;
    let lineaok = false;
    let fichero = "";
    
    lr = new LineByLineReader(archivo);
    lr.on('line', function (line) {

        let RESPUESTASCORRECTAS = [];

        //console.log(last);
        lineaok = false;
        
        /* respuestas validas */
        if (line.match(/var res = new Array/)) {
            line = line.replace(/var res = new Array\(/, " ");
            line = line.replace(/\);/, " ");
            line = line.replace(/(\r\n|\n|\r|\t)/gm, "");
            line = line.replace(/\"/g,"").toUpperCase();
            RESPUESTASCORRECTAS = line.split(","); 
            lineaok = false;
            console.log(RESPUESTASCORRECTAS);
            numpregunta = 0;
         
            
        }

        line = line.replace("';","");
        line = line.replace(" = '","");

        /* enunciado, resetea el iterador de respuesta */
        if (line.match(/var E(\d)*/)) {
            line = "\n"+line.replace(/var E(\d)*/, "");
            numrespuesta = 0;
            lineaok = true;
            fichero += line+numpregunta;
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
            fichero += '\r\n';
            numpregunta++;
            
        }

        if (lineaok) {
            //console.log(line);
            fichero += '\r\n';
        }

        lr.on('end', function () {
            // All lines are read, file is closed now.
            callback(fichero);
        });

       
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

