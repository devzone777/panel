var objectValues = require('object-values')
var queryString = require('query-string')
var html = require('choo/html')
var xtend = require('xtend')

var Uploader = require('../components/uploader')
var methodsFile = require('../lib/file')
var uploader = Uploader()

module.exports = FilesAll

function FilesAll (state, emit) {
  var pageFiles = objectValues(state.page.files || { }).map(function (pageFile) {
    var data = xtend(pageFile, { })
    data.urlPanel = queryString.stringify(xtend({
      file: methodsFile.encodeFilename(pageFile.filename)
    }, state.query))
    data.urlPanel = unescape(data.urlPanel)
    return data
  })

  return html`
    <div class="x xw p4 pt3 xx">
      <div class="w100 ">
        <div class="x xjb py1 c12 usn fs0-8 ttu fc-bg25">
          <div class="fwb">
            Files
          </div>
          <div>
            <a
              href="?file=new"
              class="button-inline green"
              onclick=${handleFilesAdd}
            >Upload</a>
          </div>
        </div>
        ${handleFilesUpload ? elUploadContainer() : ''}
        <ul class="c12 myc1 lsn">
          ${elsFiles(pageFiles)}
        </div>
      </div>
    </div>
  `

  function elUploadContainer () {
    return html` 
      <div class="
        ${state.ui.dragActive ? 'x' : 'dn'}
        bgwhite input psa t0 l0 r0 b0 x xjc xac
      ">
        ${uploader.render({
          text: 'Drag and drop here to add files',
          handleFiles: handleFilesUpload,
          handleDragEnter: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
            el.classList.remove('bgwhite', 'tcblack')
            el.classList.add('bgblack', 'tcwhite')
          },
          handleDragLeave: function (event) {
            var el = event.target.parentNode.parentNode.parentNode
            el.classList.add('bgwhite', 'tcblack')
            el.classList.remove('bgblack', 'tcwhite')
          }
        }, emit)}
      </div>
    `
  }

  function handleFilesAdd (event) {
    uploader.open()
    event.preventDefault()
  }

   function handleFilesUpload (event, data) {
    emit(state.events.ENOKI_FILES_ADD, {
      path: state.page.path,
      url: state.page.url,
      files: data.files
    })
  }
}

function elsFiles (files) {
  files = files || [ ]

  // Hide if there is nothing
  if (files.length <= 0) return html`
    <li class="m0 py1 tcgrey">
      No files
    </li>
  `

  return files.map(function (child) {
    return html`
      <li id="${child.url}" class="m0">
        <a
          href="?${child.urlPanel}"
          class="db py1 truncate"
        >${child.filename}</a>
      </li>
    `
  })
}