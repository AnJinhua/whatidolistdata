import { IconButton } from '@material-ui/core'
import SignupOptions from './SignupOptions'
import Avatar from '@mui/material/Avatar'
import EmailCode from './EmailCode'
import UserDetails from './UserDetails'
import Password from './Password'
import Preview from './Preview'
import { BackIcon, CancelIcon, SignupModal, LinkContainer } from './styles'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { TOGGLE_SIGNUP_STEP } from '../../../constants/actions'
import { decryptQueryParams } from 'query-string-hash'
import Logo from '../../../assets/logo-icon.png'

const SignUp = ({ show, unSetUserSignup, setUserLogin }) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email('email is not valid')
      .required('email is required'),
    code: yup.number().required('enter six digit code'),
    // .length(6, "enter six digit code")
    firstName: yup
      .string()
      .required('first name is required')
      .min(1, 'first name is too short')
      .max(32, 'first name is too long')
      .trim(),
    lastName: yup
      .string()
      .required('last name is required')
      .min(1, 'last name is too short')
      .max(32, 'last name is too long')
      .trim(),
    category: yup.string().required('select category'),
    subCategory: yup.string().required('select sub-category'),
    password: yup
      .string()
      .required('password is required')
      .min(6, '6 characters minimum')
      .matches(RegExp('(.*[a-z].*)'), 'one lowercase letter')
      .matches(RegExp('(.*[A-Z].*)'), 'one uppercase letter')
      .matches(RegExp('(.*\\d.*)'), 'one number')
      .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), 'one special character'),
    confirm_password: yup
      .string()
      .required('confirm your password')
      .oneOf([yup.ref('password'), null], 'password must match'),
  })

  const {
    getValues,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const page = useSelector((state) => state.auth.page)
  const dispatch = useDispatch()

  const handlePage = (page) => {
    dispatch({ type: TOGGLE_SIGNUP_STEP, payload: page })
  }

  const queryParams = new URLSearchParams(window.location.search)
  const userCode = queryParams.get('token')
  const userEmail = decodeURI(window.location.pathname.split('/')[2])

  if (userEmail && userCode) {
    const decryptedCode = decryptQueryParams(userCode)

    setValue('email', userEmail)
    setValue('code', decryptedCode?.code)
  }

  const FormTitles = [
    'Sign Up',
    'verify email',
    'enter details',
    'confirm details',
    'password',
  ]

  const cancelSignup = () => {
    handlePage(0)
    reset()
    unSetUserSignup()
  }

  const openLogin = () => {
    unSetUserSignup()
    setUserLogin(true)
  }

  const pageToDisplay = [
    SignupOptions,
    EmailCode,
    UserDetails,
    Preview,
    Password,
  ]

  const PageDisplay = () => {
    const Page = pageToDisplay[page]
    return (
      <Page
        register={register}
        errors={errors}
        handlePage={handlePage}
        setValue={setValue}
        getAllValues={getValues}
        resetUserSignup={cancelSignup}
      />
    )
  }
  return (
    <SignupModal open={show} style={{ overflow: 'scroll' }}>
      <div className='modal-container'>
        <div className='wrap-container'>
          <div className='header'>
            <div className='header-title'>
              {page > 0 && (
                <IconButton
                  onClick={() => {
                    handlePage(page - 1)
                  }}
                >
                  <BackIcon />
                </IconButton>
              )}

              {page > 0 && (
                <p className='step-header' style={{ margin: '0px' }}>
                  {`step ${page} of ${FormTitles.length - 1}`}
                </p>
              )}
            </div>

            <IconButton onClick={cancelSignup}>
              <CancelIcon />
            </IconButton>
          </div>
          <Avatar
            src={Logo}
            sx={{ m: 1, bgcolor: 'secondary.main', alignSelf: 'center' }}
          ></Avatar>
          <p className='header-text'>{FormTitles[page]}</p>
          <div>
            <PageDisplay />
          </div>
        </div>
        <div className='signup-footer'>
          <span>Already have an account?</span>&nbsp;
          <LinkContainer className='login-footer-link' onClick={openLogin}>
            Log in
          </LinkContainer>
        </div>
      </div>
    </SignupModal>
  )
}

export default SignUp
