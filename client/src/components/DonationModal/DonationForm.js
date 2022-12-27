import React from 'react'
import Avatar from '@mui/material/Avatar'
import Logo from '../../assets/stripe_logo.png'
import paystackLogo from '../../assets/paystack.png'
import { useSelector, useDispatch } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { API_URL, CLIENT_ROOT_URL } from '../../constants/api'
import { sendNotification } from '../../subscription'
import useSWR from 'swr'
import { sendMaillNotification } from '../../actions/messenger'
import { ETH_DONATION, DONATION_CHANGE } from '../../constants/actions'
import { LinkContainer } from './styles'

const DonationForm = ({ stripeAccount, isPaystackAvailable }) => {
  const default_props = {
    errorMessage: '',
    message: '',
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [state, setState] = React.useState(default_props)
  const [loading, setLoading] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const user = useSelector((state) => state.user.profile)
  const dispatch = useDispatch()

  const receiverSlug = decodeURI(window.location.pathname.split('/')[3])

  const paystackUrl = `${API_URL}/paystack/${receiverSlug}`
  const { data: paystackAccount } = useSWR(paystackUrl)

  const { data: expert, error } = useSWR(
    `${API_URL}/getExpertDetail/${receiverSlug}`
  )

  const onSubmit = async (data) => {
    setLoading(false)
    const url = paystackAccount?.status
      ? `${API_URL}/paystack/checkout`
      : `${API_URL}/stripe-connect/account/payment`

    const receiverAccount = paystackAccount?.status
      ? paystackAccount?.data?.subaccount_code
      : stripeAccount?.data?.stripe_acct_id

    const accountUsed = paystackAccount?.status ? 'paystack' : 'stripe'

    try {
      setLoading(true)
      setState({
        ...state,
        errorMessage: '',
      })

      const response = await axios.post(url, {
        ...data,
        sender: user,
        location: window.location.pathname,
        account: receiverAccount,
      })

      if (response?.data?.stripeAccount && receiverSlug !== user?.slug) {
        let pushNotificationData = {
          title: `${user?.profile?.firstName} ${user?.profile?.lastName} initiated a donation of $${data?.amount} thru stripe`,
          description: `The transaction will appear in your transaction history when completed.`,
          userSlug: receiverSlug,
          senderSlug: user?.slug,
          action: 'view transaction',
          endUrl: `/transaction-history/${receiverSlug}`,
        }

        sendNotification(pushNotificationData)

        const emailNotificationData = {
          recieverName: `${expert?.data?.profile?.firstName} ${expert?.data?.profile?.lastName}`,
          message: `${user?.profile?.firstName} ${user?.profile?.lastName} sent you a donation of $${data?.amount} via ${accountUsed}. It will appear in your transaction history once completed.`,
          senderName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
          recieverEmail: expert?.data?.email,
          url: CLIENT_ROOT_URL + `/transaction-history/${receiverSlug}`,
          defaultUrl: CLIENT_ROOT_URL,
        }

        sendMaillNotification(emailNotificationData, 'notifyUser')
      }

      setLoading(false)

      window.open(response?.data?.url, '_self')
    } catch (error) {
      setState({
        ...state,
        errorMessage: ` ${expert?.data?.profile?.firstName} ${expert?.data?.profile?.lastName} has not been confirmed to be eligible for payment.`,
      })

      if (receiverSlug !== user?.slug) {
        let pushNotificationData = {
          title: `${user?.profile?.firstName} ${user?.profile?.lastName} wants to donate to you, set up your ${accountUsed} account to receive payment.`,
          description: `complete the setup of your stripe account in order to accept donations.`,
          userSlug: receiverSlug,
          senderSlug: user?.slug,
          action: 'setup account',
          endUrl: `/payment-settings/${receiverSlug}`,
        }

        sendNotification(pushNotificationData)

        const emailNotificationData = {
          recieverName: `${expert?.data?.profile?.firstName} ${expert?.data?.profile?.lastName}`,
          message: `${user?.profile?.firstName} ${user?.profile?.lastName} wants to donate to you, set up your ${accountUsed} account to receive payment.`,
          senderName: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
          recieverEmail: expert?.data?.email,
          url: CLIENT_ROOT_URL + `/payment-settings/${receiverSlug}`,
          defaultUrl: CLIENT_ROOT_URL,
        }

        sendMaillNotification(emailNotificationData, 'notifyUser')
      }

      setLoading(false)
      // error?.response?.data?.message,
    }
  }

  const setEthModal = () => {
    dispatch({
      type: ETH_DONATION,
      payload: true,
    })

    dispatch({
      type: DONATION_CHANGE,
      payload: false,
    })
  }

  return (
    <>
      {step === 0 && (
        <div className='login-wapper'>
          <div className='avartar'>
            <Avatar
              alt='Remy Sharp'
              src={isPaystackAvailable ? paystackLogo : Logo}
              sx={{ width: 56, height: 56, borderRadius: '50%' }}
            />
          </div>
          <div className='login-header2'>
            {' '}
            {isPaystackAvailable
              ? 'Donate with paystack'
              : 'Donate with stripe'}
          </div>
          {state.errorMessage &&
            state.errorMessage !== null &&
            state.errorMessage !== undefined &&
            state.errorMessage !== '' && (
              <div className='alert alert-danger'>
                <i className='fa fa-exclamation-circle' aria-hidden='true'></i>
                {state.errorMessage}
              </div>
            )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              sx={{ my: 1.5, width: '100%' }}
              fullWidth
              label={'donate a minimum of $10'}
              id='fullWidth'
              variant='outlined'
              type='number'
              inputProps={{ style: { fontSize: 16 } }}
              InputLabelProps={{ style: { fontSize: 11 } }}
              color='primary'
              {...register('amount', {
                required: 'Required field',
                min: 10,
              })}
              error={!!errors?.amount}
              helperText={errors?.amount && `amount must be $10 and above`}
            />

            <div className='lgn-btn'>
              <LoadingButton
                fullWidth
                type='submit'
                variant='contained'
                style={{
                  backgroundColor: 'var(--primary-color)',
                  height: 50,
                }}
                color='primary'
                size='large'
                loading={loading}
              >
                {isPaystackAvailable ? 'Pay with Paystack' : 'Pay with Stripe'}
              </LoadingButton>
            </div>
          </form>
          <p style={{ textAlign: 'center' }}>
            whatido utilizes 10% of this transaction to maintain this platform
            and to serve you better
          </p>
        </div>
      )}
      <LinkContainer onClick={setEthModal}>
        <p>pay with ethereum wallet</p>
      </LinkContainer>
    </>
  )
}

export default DonationForm
