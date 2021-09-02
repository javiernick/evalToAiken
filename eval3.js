const fruitBasket = {
    apple: 27,
    grape: 0,
    pear: 14
  }


const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  const getNumFruit = fruit => {
    return sleep(1000).then(v => fruitBasket[fruit])
  }
  const fruitsToGet = ['ua2_ue30_eval1.html', 'ua2_ue30_eval2.html', 'ua2_ue30_eval3.html'];
  const forLoop = async _ => {
  console.log('Start')

  for (let index = 0; index < fruitsToGet.length; index++) {
    const fruit = fruitsToGet[index]
    const numFruit = await toAkien(RUTA_FOLDER+fruit)
    console.log(numFruit)
  }

  console.log('End')
}

  forLoop();