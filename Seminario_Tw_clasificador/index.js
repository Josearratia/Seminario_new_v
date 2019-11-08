const TrainingSet = require('./datos_de_entrenamiento.json')
const natural = require('natural')
const BrainJs = require('brain.js')
var Twit = require('twit')
const neurona = new BrainJs.NeuralNetwork()

var T = new Twit({
  consumer_key:         '8lMJ0CUfzabzDTbDsRR8hfFCk',
  consumer_secret:      'c6Wl6AU2q8h38hloJiBvFj5JvfKdE6WFxgizIjzxR2iCA91gQl',
  access_token:         '832858948332040193-NTS8UjI4p8IF0k3ZmbvttNQmVDkO3w0',
  access_token_secret:  'ZdNgJFzl96vqmflyJtu5Co9HRAF4TVdlQnHDCgSVMo5e1',
  timeout_ms:           90*1000,  
  strictSSL:            true,     
})

function construir_diccionario (trainingData) {
  const tokenisedArray = trainingData.map(item => {
    const tokens = item.phrase.split(' ')
    return tokens.map(token => natural.PorterStemmer.stem(token))
  })
  
  const flattenedArray = [].concat.apply([], tokenisedArray)
  return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos)
}

const diccionario = construir_diccionario(TrainingSet)

function codificar (phrase) {
  const phraseTokens = phrase.split(' ')
  const encodedPhrase = diccionario.map(word => phraseTokens.includes(word) ? 1 : 0)

  return encodedPhrase
}

  const Conjunto_de_entrenamiento_codificado = TrainingSet.map(dataSet => {
  const encodedValue = codificar(dataSet.phrase)
  return {input: encodedValue, output: dataSet.result}
})

neurona.train(Conjunto_de_entrenamiento_codificado)

let mensaje = 'perros'
let cantidad_a_buscar = 3


T.get('search/tweets', { q: mensaje, count: cantidad_a_buscar }, function(err, data, response) {
  for(var i = 0; i < cantidad_a_buscar; i ++){
    console.log(i+" -Texto ---- " + data.statuses[i].text)
    console.log(neurona.run(codificar(data.statuses[i].text)))
  }
})
