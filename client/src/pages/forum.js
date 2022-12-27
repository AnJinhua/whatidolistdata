import React from 'react'

const forum = () => {
  ;(function () {
    // DON'T EDIT BELOW THIS LINE
    var d = document,
      s = d.createElement('script')
    s.src = 'https://donnieslist.disqus.com/embed.js'
    s.setAttribute('data-timestamp', +new Date())
    ;(d.head || d.body).appendChild(s)
  })()

  return (
    <div id='experts-list' className='experts-list min-height-full-page'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <div id='disqus_thread'></div>
            <noscript>
              Please enable JavaScript to view the
              <a href='https://disqus.com/?ref_noscript'>
                comments powered by Disqus.
              </a>
            </noscript>
          </div>
        </div>
      </div>
    </div>
  )
}

export default forum
