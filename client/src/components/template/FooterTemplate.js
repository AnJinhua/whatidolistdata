//get current year
const date = new Date()
const year = date.getFullYear()

function FooterTemplate() {
  if (window.location.pathname.split('/')[1] === 'finishsignUp') {
    return null
  }
  if (window.location.pathname.split('/')[1] === 'register') {
    return null
  }
  return (
    <footer className='footer'>
      <center>
        © {year}-{year + 1} the global network, llc. / what i do{' '}
      </center>
    </footer>
  )
}

export default FooterTemplate
