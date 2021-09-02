const fs = require('fs');
const lineReader = require('line-reader');

const RESPUESTAS = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)', 'G)', 'H)', 'I)'];

const RUTA_FOLDER = './eval/';



const toAkien = async (archivo) => {

    const lineReader = require('line-reader');

    let numrespuesta = 0;
    let numpregunta = 0;
    let lineaok = false;
    let fichero = "";
    let RESPUESTASCORRECTAS = [];


    // reading with file position boundaries
    lineReader.eachLine(archivo, function(line, last) {
       
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
            
            fs.writeFile(archivo.replace('.html', '.txt'), fichero, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
            
                // success case, the file was saved
                console.log('Lyric saved!');
            });
            /*
            try {
                fs.unlinkSync(archivo)
                
              } catch(err) {
                console.error(err)
              }
            */
            return false; // stop reading
        }


    });

}


const getFicheros = ( ruta ) => {

    fs.readdir(ruta, function (err, archivos) {
        if (err) {
        onError(err);
        return;
        }
        const txtFiles = archivos.filter(el => /\.html$/.test(el))
        //console.log(txtFiles);
        
        txtFiles.forEach(element => {        
            toAkien(ruta+element);
        });

    });

}

getFicheros( RUTA_FOLDER ) ;
