const db = require('../../data/db-config')

async function find() { 
  const result = await db.select('schemes.scheme_id', 'scheme_name')
  .count('steps.step_id as number_of_steps')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .groupBy('schemes.scheme_id')
  .orderBy('schemes.scheme_id', 'asc')
  return result
  //.count('steps.step_id').as('number_of_steps').from('schemes').leftJoin('steps', 'schemes.scheme_id', 'steps.scheme.id')
  // console.log('output -------->', output)
}  
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    If we change from a left join to an inner join: it will return only the row which have data in the scheme_id column for both table
  (number_of_steps and sc). The left join would return these result and the row that have a scheme_id value in the 
  number_of_steps table only. 

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */


async function findById(scheme_id) { // EXERCISE B
  const result = await db.select('scheme_name', 'schemes.scheme_id', 'step_id', 'step_number', 'instructions')
  .from('schemes')
  .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  .where('schemes.scheme_id', scheme_id)
  .orderBy('step_number', 'asc')
  const sortedResult = result.map( res => {
    return { 
      step_id: res.step_id,
      step_number: res.step_number,
      instructions: res.instructions
    }
  })
  const finalResult = {
    scheme_id: parseInt(scheme_id),
    scheme_name: result[0].scheme_name,
    steps: sortedResult? sortedResult: []
  }
  return finalResult
  
  /*
    
    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

async function findSteps(scheme_id) { // EXERCISE C
  // SELECT step_id, step_number, instructions, scheme_name
  // FROM steps as st
  // JOIN schemes as sc
  // ON st.scheme_id = sc.scheme_id
  // ORDER BY step_number
  const result = await db.select('scheme_name', 'step_id', 'step_number', 'instructions')
    .from('steps')
    .leftJoin('schemes', 'schemes.scheme_id', 'steps.scheme_id')
    .where('scheme_id', scheme_id)
    .orderBy('step_number', 'asc')
  return result || []
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  const newId = await db('schemes').insert(scheme)
  return db('schemes').where({id: newId})
}

async function addStep(scheme_id, step) { // EXERCISE E
  await db('steps').insert(step).where({scheme_id : scheme_id})
  const result = await findSteps(scheme_id)
  return result
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
