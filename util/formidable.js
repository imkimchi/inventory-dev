import IncomingForm from 'formidable'
import shortid from 'shortid'
import path from 'path'

let form = new IncomingForm()
form.encoding = "utf-8"

form.on("fileBegin", function(name, file) {
    let regex = /[^.]*/
    let fileName = file.name.replace(regex, shortid())
    file.path = path.join(__dirname + '/../views/images/uploads', fileName)
})

export default form