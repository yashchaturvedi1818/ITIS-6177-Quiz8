const mariadb = require('mariadb');
const express = require('express');
var bodyParser = require('body-parser');
const port = 3000;
const pool = mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password: 'root',
    port: 3306,
    connectionLimit:5
});
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'Yash Demo App',
            version: '1.0.0',
            description: 'Rest Api and swaggger demo'
        },
        host: '159.65.239.185:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
/**
 * @swagger
 * /agents:
 *     get:
 *       description: Returns all agents
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: All details wrt Agents
*/
app.get('/agents',(request,resp) =>{
    pool.query('SELECT * from sample.agents')
        .then(result => {
                resp.statusCode = 200;
                resp.setHeader('Content-Type','Application/json');
                resp.send(result);
                })
        .catch(err =>{ 
                resp.statusCode = 500;
                console.error('Error running query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error running query' + err.stack);
        });
    // res.json(prices);
});



/**
 * @swagger
 * /agents:
 *  delete:
 *    description: Removes product
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: name
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentDel"
 *    responses: 
 *      200:
 *       description: response specifying if product was removed
 * definitions:
 *   agentDel:
 *     type: object
 *     required:
 *     - agentCode
 *     properties:
 *       agentCode:
 *         type: string
 *         example: 'A145'
*/
app.delete('/agents',(request,resp) =>{
    pool.query(`delete from sample.agents where agent_Code =  ('${request['body'].agentCode}')`).then(result => {
               console.log(result);
                 if(result.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(result);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('There was a error deleting response');
                }
               })
        .catch(err =>{
                resp.statusCode = 500;
                console.error('Error running query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error running query' + err.stack);
        });
});


/**
 * @swagger
 * /agents:
 *  put:
 *    description: Updates agents
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPut"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPut"
 *    responses: 
 *      200:
 *       description: A successfull response that the record has been updated
 * definitions:
 *   agentPut:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A485
 *       agentName:
 *         type: string
 *         example: josh
 *       workingArea: 
 *         type: string
 *         example: bhopal
 *       commission:
 *         type: number
 *         example: 5
 *       phoneNo:
 *         type: string
 *         example: 9912345621
 *       country:
 *         type: string
 *         example: India
*/
app.put('/agents', (request,resp) =>{
    pool.query(`update sample.agents set agent_name = '${request['body'].agentName}',  working_area = '${request['body'].workingArea}', commission  = '${request['body'].commission}', phone_no = '${request['body'].phoneNo}', country = '${request['body'].country}' where agent_code = '${request['body'].agentCode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send("Agent not found");
                }
              })
        .catch(err =>{
                resp.statusCode = 500;
                console.error('Error running query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error running query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  patch:
 *    description: updates or inserts agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPatch"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPatch"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPatch:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A300
 *       agentName:
 *         type: string
 *         example: Kim Davis
 *       workingArea:
 *         type: string
 *         example: hyderabad
 *       commission:
 *         type: number
 *         example: 5
 *       phoneNo:
 *         type: string
 *         example: 9912345621
 *       country:
 *         type: string
 *         example: India
*/
app.patch('/agents',(request,resp) =>{
    pool.query(`update sample.agents set agent_name = '${request['body'].agentName}',  working_area = '${request['body'].workingArea}', commission  = '${request['body'].commission}', phone_no = '${request['body'].phoneNo}', country = '${request['body'].country}' where agent_code = '${request['body'].agentCode}'`).then(res => {
                console.log(result.affectedRows);
                if(result.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                    pool.query(`insert into sample.agents values('${req['body'].agentCode}', '${req['body'].agentName}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phoneNo}', '${req['body'].country}')`).then(res1 => {
                        if(res1.affectedRows > 0)
                        {
                            resp.statusCode = 200;                 
                            resp.setHeader('Content-Type','Application/json');
                            resp.send(res1);
                        }
                        else{
                            resp.statusCode = 201;
                            resp.setHeader('Content-Type','text/plain');
                            resp.send("The agent is not located in the table - Operation  unsuccessful");
                        }
                    })
                    .catch(err =>{
                        resp.statusCode = 500;
                        console.error('Error running query', err.stack);
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('Error running query' + err.stack);
                    });
                }
              })
        .catch(err =>{
                resp.statusCode = 500;
                console.error('Error running query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error running query' + err.stack);
        });
});


/**
 * @swagger
 * /agents:
 *  post:
 *    description: Updates agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentCode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentPost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentPost"
 *    responses:
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentPost:
 *     type: object
 *     required:
 *     - agentCode
 *     - agentName
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentCode:
 *         type: string
 *         example: A007
 *       agentName:
 *         type: string
 *         example: Jim
 *       workingArea:
 *         type: string
 *         example: Bangalore
 *       commission:
 *         type: number
 *         example: 10
 *       phoneNo:
 *         type: string
 *         example: 8901231242
 *       country:
 *         type: string
 *         example: India
*/
app.post('/agents',(request,resp) =>{
    pool.query(`insert into sample.agents values ('${request['body'].agentCode}', '${request['body'].agentName}', '${request['body'].workingArea}', '${request['body'].commission}', '${request['body'].phone_no}', '${request['body'].country}')`).then(result => {
               console.log(result);
                 if(result.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(result);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('There was some error inserting new record');
                }
               })
        .catch(err =>{
                resp.statusCode = 500;
                console.error('Error running query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error running query' + err.stack);
        });
});


app.listen(port, ()=>{
    console.log(`API server at ${port}`);
});