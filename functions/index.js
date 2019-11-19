const functions = require('firebase-functions');
const cors = require('cors')({ origin: true })
const admin = require('firebase-admin')
admin.initializeApp()

const database = admin.database().ref('/doctors')
//================================================Doctor Sigup======================================================//
exports.addDoctor = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        console.log(req.body)
        let data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        if (!data.name) {
            res.status(400).json({
                message: "Username is required"
            })
        }

        if (!data.email) {
            res.status(400).json({
                message: "email is required"
            })
        }
        if (!data.password) {
            res.status(400).json({
                message: "password is required"
            })
        }
        database.push(data);
        let doctors = [];
        return database.on('value', (snapshot) => {
            snapshot.forEach((doctor) => {
                doctors.push({
                    _id: doctor.key,
                    name: doctor.val().name,
                    email: doctor.val().email,
                    password: doctor.val().password,
                });
            });
            res.status(200).json(doctors)
        }, (error) => {
            res.status(error.code).json({
                message: `Something went wrong. ${error.message}`
            })
        })
    })
})

//======================================================Doctor Signin================================//
exports.addDoctor = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        console.log(req.body)
        let data = {

            email: req.body.email,
            password: req.body.password
        }

        if (!data.email) {
            res.status(400).json({
                message: "email is required"
            })
        }
        if (!data.password) {
            res.status(400).json({
                message: "password is required"
            })
        }

        let doctors = [];
    })
})




//==============================doctor Adding Patient =================================================//

const patientDb = admin.database().ref('/patients')

exports.addPatient = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        console.log(req.body)
        let patient = {
            name: req.body.name,
            dateOfArrival: req.body.dateOfArrival,
            disease: req.body.disease,
            docid : req.body.docid,
           history : [
               
           ]
            
           
        }

        patientDb.push(patient);
        let patients = [];
        return patientDb.on('value', (snapshot) => {
            snapshot.forEach((patient) => {
                patients.push({
                    docid : patient.val().docid,
                    _id: patient.key,
                    name: patient.val().name,
                    dateOfArrival: patient.val().dateOfArrival,
                    disease: patient.val().disease,
                    history : patient.val().history,
                    
                });
            });
            res.status(200).send(patients)
        }, (error) => {
            res.status(error.code).json({
                message: `Something went wrong. ${error.message}`
            })
        })
    })
})



//=================================Doctor getting list of All Patients======================================>//

exports.getPatients = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(404).json({
                message: 'Not allowed'
            })
        }

        let allpatients = [];

        return patientDb.on('value', (snapshot) => {
            snapshot.forEach((patient) => {
                allpatients.push({
                    docid : patient.val().docid,
                    _id: patient.key,
                    name: patient.val().name,
                    dateOfArrival: patient.val().dateOfArrival,
                    disease: patient.val().disease,
                    history: patient.val().history
                });
            });

            res.status(200).json(allpatients)
        }, (error) => {
            res.status(error.code).json({
                message: `Something went wrong. ${error.message}`
            })
        })
    })
})


//======================================Doctor getting specific patient============================//

exports.specific = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'GET') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        let specific = {};
        const id = req.query.id
        return patientDb.on('value', (snapshot) => {
            snapshot.forEach((patient) => {
                if (patient.key === id) {
                    
                    specific = {
                        _id: patient.key,
                        name: patient.val().name,
                        dateOfArrival: patient.val().dateOfArrival,
                        disease: patient.val().disease,
                        history: patient.val().history
                    };
                }
            });

            res.status(200).json(specific)
        }, (error) => {
            res.status(error.code).json({
                message: `Something went wrong. ${error.message}`
            })
        })
    })
})

//================================Adding New Record to History of Specfic patient======================


exports.addrecord = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(401).json({
                message: 'Not allowed'
            })
        }
        const id = req.query.id;
        const updateHistory = admin.database().ref(`/patients/${id}`)
       const a = updateHistory.child('/history')

        let newRecord = {
            checkupDate: req.body.checkupDate,
            medicineSuggested: req.body.medicineSuggested,
            cost: req.body.cost
        }

        console.log(newRecord)

      
       updateHistory.on('value',patient=>{
        
           const oldrecords = patient.val().history ? patient.val().history : []
           oldrecords.push(newRecord)
           
           a.update(oldrecords)
           res.json(oldrecords)
       })
    })
})
