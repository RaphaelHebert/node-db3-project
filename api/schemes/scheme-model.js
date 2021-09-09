const db = require('../../data/db-config')

async function find() { 
  const result = await db.select('schemes.scheme_id', 'scheme_name')
  .count('steps.step_id as number_of_steps')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .groupBy('schemes.scheme_id')
  .orderBy('schemes.scheme_id', 'asc')
  return result
}  
  


async function findById(scheme_id) { // EXERCISE B
  const result = await db.select('scheme_name', 'schemes.scheme_id', 'step_id', 'step_number', 'instructions')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .where('schemes.scheme_id', scheme_id)
  .orderBy('step_number', 'asc')
  const sortedResult = result[0].step_number === null? [] : result.map( res => {
    return { 
      step_id: res.step_id,
      step_number: res.step_number,
      instructions: res.instructions
    }
  })
  const finalResult = {
    scheme_id: parseInt(scheme_id),
    scheme_name: result[0].scheme_name,
    steps: sortedResult
  }
  return finalResult
}

async function findSteps(scheme_id) { // EXERCISE C
  const result = await db.select('scheme_name', 'schemes.scheme_id', 'step_id', 'step_number', 'instructions')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .where('schemes.scheme_id', scheme_id)
  .orderBy('step_number', 'asc')
  const sortedResult = result[0].step_number === null? [] : result.map( res => {
    return { 
      step_id: res.step_id,
      step_number: res.step_number,
      instructions: res.instructions,
      scheme_name: result[0].scheme_name
    }
  })
  return sortedResult
}

async function add(scheme) { 
  const newId = await db('schemes').insert(scheme)
  const result = await db('schemes').where({scheme_id: newId})
  return result[0]
}

async function addStep(scheme_id, step) { 
  step.scheme_id = scheme_id
  const newStepId = await db('steps').insert(step)
  const result = await findSteps(scheme_id)
  return result
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
