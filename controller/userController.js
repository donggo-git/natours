const fs = require('fs')
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))

exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: users.length,
        data: {
            users
        }
    })
}

exports.createUsers = (req, res) => {

    const newID = users[users.length - 1]._id + 1;
    const newUser = Object.assign({ id: newID }, req.body)

    users.push(newUser)

    fs.writeFile('./dev-data/data/users.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newUser
            }
        })
    })

}

exports.getUser = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

exports.updateUser = (req, res) => {
    const id = req.params.id * 1;
    const orgTour = tours.find(el => el.id === id)

    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    //Update tour

    //send updated data back to user
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<>'
        }
    })
}

exports.deleteUser = (req, res) => {
    const id = req.params.id * 1

    if (id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    //delete tour from json file
    const newTour = tours.filter(el => el.id != id)
    console.log(newTour)
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })

    res.status(204).json({
        status: 'success',
        data: null
    })
}
