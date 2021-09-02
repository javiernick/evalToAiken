const fs = require('fs-promise');
const path = require('path');
const lineReader = require('line-reader');

const RESPUESTAS = ['A)', 'B)', 'C)', 'D)', 'E)', 'F)', 'G)', 'H)', 'I)'];

const RUTA_FOLDER = './eval/';
function readdirAsync(path) {
    return new Promise(function (resolve, reject) {
      fs.readdir(path, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  names = await readdirAsync(RUTA_FOLDER);

  console.log(names);


const getFiles = async () => {
    /*
    const files = fs.readdir(RUTA_FOLDER, function (err, archivos) {
        if (err) {
            onError(err);
        return;
        }
        const txtFiles = archivos.filter(el => /\.html$/.test(el));
        //console.log(txtFiles);
        return txtFiles;
    })
    */
    

}

async function Procesar() {

    const files = await getFiles();
    
    //toAkien(RUTA_FOLDER+element);


}

//Procesar();

const toAkien = async (archivo) => {

    console.log(archivo);
        
    let RESPUESTASCORRECTAS = [];

    let numrespuesta = numpregunta = 0;
    let lineaok = false;
    let fichero = "";

    // reading with file position boundaries
    lineReader.eachLine(archivo, function(line, last) {

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
         //return false;
            
        }

        line = line.replace("';","");
        line = line.replace(" = '","");

        /* enunciado, resetea el iterador de respuesta */
        if (line.match(/var E(\d)*/)) {
            line = "\n"+line.replace(/var E(\d)*/, "");
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
            fichero += '\r\n';
            numpregunta++;
            
        }

        if (lineaok) {
            console.log(line);
            fichero += '\r\n';
        }

        if (last) {
            
            fs.writeFile(archivo.replace('.html', '.txt'), fichero, (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;
            
                // success case, the file was saved
                console.log('Lyric saved!');
            });
            return false; // stop reading
        }


    });

}

