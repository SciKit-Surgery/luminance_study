// Pull the logic for making anatomy actors out of main loop
import vtkConeSource from '@kitware/vtk.js/Filters/Sources/ConeSource.js'
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper.js'
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor.js'
import vtkXMLPolyDataReader from '@kitware/vtk.js/IO/XML/XMLPolyDataReader.js'

export function coneactor () {
  const coneSource = vtkConeSource.newInstance({ height: 1.0 })

  const mapper = vtkMapper.newInstance()
  mapper.setInputConnection(coneSource.getOutputPort())

  const sksactor = vtkActor.newInstance()
  sksactor.setMapper(mapper)
  sksactor.getProperty().setOpacity(0.5)

  return sksactor
}

export function tumouractor (callback) {
  const reader = vtkXMLPolyDataReader.newInstance()
  const filename = '011_tumor.vtp'
  let error = false
  reader.setUrl(`assets/${filename}`).then(() => {
    const polydata = reader.getOutputData(0)
    const mapper = vtkMapper.newInstance()
    const actor = vtkActor.newInstance()

    actor.setMapper(mapper)
    mapper.setInputData(polydata)
    const rgbcol = hexToRgb('#FF9900')
    console.log(rgbcol)
    actor.getProperty().setColor(rgbcol.r, rgbcol.g, rgbcol.b)
    callback(error, actor)
  })
    .catch(err => {
      error = true
      callback(err, null)
    })
}

function hexToRgb (hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      }
    : null
}
