const db = require('../../data/db-config')
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const scheme = await db('schemes').where('schemes.scheme_id', req.params.scheme_id)
  if(scheme.length > 0){
    next()
  } else {
    next({
      status: 404,
      message: `scheme with scheme_id ${req.params.scheme_id} not found`
    })
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const { scheme_name } = req.body
  if(!scheme_name || typeof scheme_name !== 'string' || scheme_name === ''){
    next({
      status: 400,
      message: "invalid scheme_name"
    })
  } else {
    next()
  }

}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const {step_number, instructions} = req.body
  if (!instructions || typeof instructions !== 'string' || !step_number || typeof step_number !== 'number' || step_number < 1 ){
    next({
      status: 400,
      message: "invalid step"
    })
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
