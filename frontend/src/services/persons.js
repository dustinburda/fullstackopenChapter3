import axios from 'axios'

const baseUrl = "/api/persons"

const getAll = () => {
    return axios.get(baseUrl)
                .then(request => request.data)
}

const create = (personObject) => {
    return axios.post(baseUrl, personObject)
                .then(response => response.data)
}

const update = (personObject, id) => {
    return axios.put(`${baseUrl}/${id}`, personObject)
                .then(response => response.data)
}

const deletePerson = (id) => {
   return axios.delete(`${baseUrl}/${id}`)
               .then(response => response.data)
}

export default {getAll, create, update, deletePerson}

