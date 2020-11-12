const {Router} = require("express")
const router = Router()
const fs = require("fs")
const evaluacionFile = fs.readFileSync("./evaluacion.json", "utf-8") // Lectura de archivo
const evaluacionJSON = JSON.parse(evaluacionFile)

router.get("/", (req, res) => {
  res.send("API REST evaluacion")
})

router.get("/evaluacion", (req, res) => {
  res.json(evaluacionJSON)
})

router.get("/evaluacion/:id", (req, res) => {
  let id = req.params.id
  let evaluacionEncontrado = evaluacionJSON.find(evaluacion => evaluacion.id == id)

  if(evaluacionEncontrado != undefined)
    res.json(evaluacionEncontrado)
  else
    res.send(`La evaluacion con ID ${id} no existe`)
})

router.post("/evaluacion", (req, res) => {
  let {tema, puntaje} = req.body
  let id = evaluacionJSON.length + 1 
  let nuevoevaluacion = {
    id : id,
    tema : tema,
    puntaje : puntaje
  }
 
  evaluacionJSON.push(nuevoevaluacion)

  fs.writeFileSync("./evaluacion.json", JSON.stringify(evaluacionJSON), "utf-8")

  res.status(201).json(nuevoevaluacion)
})

router.put("/evaluacion/:id", (req, res) => {
  let id = req.params.id
  let {tema, puntaje} = req.body

  let evaluacionAModificar = evaluacionJSON.find(evaluacion => {
    if(evaluacion.id == id){
      evaluacion.tema = tema
      evaluacion.puntaje = puntaje
      return evaluacion
    }
  })

  if(evaluacionAModificar != undefined){
      fs.writeFileSync("./evaluacion.json", JSON.stringify(evaluacionJSON), "utf-8")
      res.status(201).json(evaluacionAModificar)
  }else{
    res.json("El ID de la evaluacion no existe")
  }
})

router.delete("/evaluacion/:id", (req, res) => {
  let id_evaluacion = req.params.id
  let evaluacion = evaluacionJSON.findIndex(evaluacion => id_evaluacion == id_evaluacion)
  
  if(id_evaluacion != -1){
    evaluacionJSON.splice(evaluacion, 1)
    fs.writeFileSync('./evaluacion.json', JSON.stringify(evaluacionJSON), 'utf-8')
    res.status(200).json(id_evaluacion + 1)
  }else{
    res.status(200).json('evaluacion no existe')
  }
})

module.exports = router